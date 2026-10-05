/**
 * Campus Interactive SVG Map Engine
 * Handles dynamic rendering, zoom/pan, node selection, and route animation.
 */

const CampusMap = {
    svg: null,
    gMap: null,
    locations: [],
    edges: [],
    currentRoute: [],
    activeSource: null,
    activeDest: null,
    selectedLocationName: null,

    // Pan & Zoom state
    zoom: 1,
    panX: 0,
    panY: 0,
    isDragging: false,
    startX: 0,
    startY: 0,

    categoryColors: {
        ENTRY: '#2E7D5B',
        ACADEMIC: '#527E61',
        LABORATORY: '#78A27F',
        ADMINISTRATION: '#9AAA8E',
        LIBRARY: '#B99A60',
        FOOD: '#E9785B',
        HOSTEL: '#A77766',
        SPORTS: '#78A99B',
        HEALTH: '#C96F5A',
        AMENITIES: '#879C8C',
        PARKING: '#7B887E',
        OTHER: '#9AA49B'
    },

    init(svgElementId = 'campus-svg-map') {
        this.svg = document.getElementById(svgElementId);
        if (!this.svg) return;

        this.svg.innerHTML = ''; // Clear

        // Create main scalable group
        this.gMap = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.gMap.setAttribute('id', 'map-viewport-group');
        this.svg.appendChild(this.gMap);

        this.attachEventListeners();
    },

    attachEventListeners() {
        if (!this.svg) return;

        this.svg.addEventListener('pointerdown', (e) => {
            if (e.target.closest('.map-node')) return; // Allow node clicking
            this.isDragging = true;
            this.startX = e.clientX - this.panX;
            this.startY = e.clientY - this.panY;
            this.svg.setPointerCapture(e.pointerId);
            this.svg.style.cursor = 'grabbing';
        });

        window.addEventListener('pointermove', (e) => {
            if (!this.isDragging) return;
            this.panX = e.clientX - this.startX;
            this.panY = e.clientY - this.startY;
            this.updateTransform();
        });

        window.addEventListener('pointerup', () => {
            this.isDragging = false;
            if (this.svg) this.svg.style.cursor = 'grab';
        });

        this.svg.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            this.setZoom(this.zoom + delta);
        }, { passive: false });
    },

    setZoom(newZoom) {
        this.zoom = Math.min(Math.max(0.6, newZoom), 2.5);
        this.updateTransform();
    },

    resetView() {
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.updateTransform();
    },

    focusLocation(location) {
        if (!location || !location.mapCoordinates) return;
        this.zoom = 1.35;
        this.panX = 500 - location.mapCoordinates.x * this.zoom;
        this.panY = 450 - location.mapCoordinates.y * this.zoom;
        this.updateTransform();
        this.showNodePopover(location, location.mapCoordinates.x, location.mapCoordinates.y);
    },

    updateTransform() {
        if (this.gMap) {
            this.gMap.setAttribute('transform', `translate(${this.panX}, ${this.panY}) scale(${this.zoom})`);
        }
    },

    renderMapData(locations, edges) {
        this.locations = locations || [];
        this.edges = edges || [];

        if (!this.gMap) return;
        this.gMap.innerHTML = '';

        // 1. Defs for glow filters & markers
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <filter id="glow-node" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        `;
        this.gMap.appendChild(defs);

        // Group for Background Grid
        const gGrid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        gGrid.setAttribute('opacity', '0.15');
        for (let x = 0; x <= 1000; x += 100) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x); line.setAttribute('y1', 0);
            line.setAttribute('x2', x); line.setAttribute('y2', 900);
            line.setAttribute('stroke', '#9bab98'); line.setAttribute('stroke-width', '1');
            gGrid.appendChild(line);
        }
        for (let y = 0; y <= 900; y += 100) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', 0); line.setAttribute('y1', y);
            line.setAttribute('x2', 1000); line.setAttribute('y2', y);
            line.setAttribute('stroke', '#9bab98'); line.setAttribute('stroke-width', '1');
            gGrid.appendChild(line);
        }
        this.gMap.appendChild(gGrid);

        // 2. Render Walkway Edges
        const gEdges = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        gEdges.setAttribute('id', 'edges-group');

        this.edges.forEach((edge, idx) => {
            const src = this.locations.find(l => l.name === edge.source);
            const dst = this.locations.find(l => l.name === edge.destination);
            if (src && dst && src.mapCoordinates && dst.mapCoordinates) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', src.mapCoordinates.x);
                line.setAttribute('y1', src.mapCoordinates.y);
                line.setAttribute('x2', dst.mapCoordinates.x);
                line.setAttribute('y2', dst.mapCoordinates.y);
                line.setAttribute('class', 'map-edge');
                line.setAttribute('data-source', src.name);
                line.setAttribute('data-dest', dst.name);
                line.setAttribute('id', `edge-${idx}`);
                gEdges.appendChild(line);
            }
        });
        this.gMap.appendChild(gEdges);

        // 3. Render Campus Location Nodes
        const gNodes = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        gNodes.setAttribute('id', 'nodes-group');

        this.locations.forEach(loc => {
            if (!loc.mapCoordinates) return;
            const x = loc.mapCoordinates.x;
            const y = loc.mapCoordinates.y;
            const color = this.categoryColors[loc.category] || '#94a3b8';

            const gNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            gNode.setAttribute('class', 'map-node');
            gNode.setAttribute('data-name', loc.name);
            gNode.setAttribute('transform', `translate(${x}, ${y})`);

            // Outer Pulse Ring
            const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            outerCircle.setAttribute('r', '14');
            outerCircle.setAttribute('fill', color);
            outerCircle.setAttribute('opacity', '0.2');
            outerCircle.setAttribute('class', 'node-pulse');

            // Inner Core Circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', '9');
            circle.setAttribute('fill', color);
            circle.setAttribute('stroke', '#ffffff');
            circle.setAttribute('stroke-width', '1.5');

            // Label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('y', '22');
            text.textContent = loc.name;

            gNode.appendChild(outerCircle);
            gNode.appendChild(circle);
            gNode.appendChild(text);

            // Click Handler for Popover
            gNode.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showNodePopover(loc, x, y);
            });

            gNodes.appendChild(gNode);
        });
        this.gMap.appendChild(gNodes);

        // Re-apply route highlight if already selected
        if (this.currentRoute && this.currentRoute.length > 0) {
            this.highlightRoute(this.currentRoute, this.activeSource, this.activeDest);
        }
    },

    renderHomePreview(locations, edges) {
        const preview = document.getElementById('home-map-preview');
        if (!preview) return;
        preview.replaceChildren();

        const lineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        lineGroup.setAttribute('class', 'preview-edges');
        (edges || []).forEach(edge => {
            const source = locations.find(location => location.name === edge.source);
            const destination = locations.find(location => location.name === edge.destination);
            if (!source?.mapCoordinates || !destination?.mapCoordinates) return;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', source.mapCoordinates.x);
            line.setAttribute('y1', source.mapCoordinates.y);
            line.setAttribute('x2', destination.mapCoordinates.x);
            line.setAttribute('y2', destination.mapCoordinates.y);
            line.setAttribute('class', 'preview-edge');
            lineGroup.appendChild(line);
        });
        preview.appendChild(lineGroup);

        const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        nodeGroup.setAttribute('class', 'preview-nodes');
        (locations || []).forEach(location => {
            if (!location.mapCoordinates) return;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', location.mapCoordinates.x);
            circle.setAttribute('cy', location.mapCoordinates.y);
            circle.setAttribute('r', '11');
            circle.setAttribute('fill', this.categoryColors[location.category] || '#7ccbd5');
            circle.setAttribute('class', 'preview-node');
            nodeGroup.appendChild(circle);
        });
        preview.appendChild(nodeGroup);
    },

    highlightRoute(path, source, destination) {
        this.currentRoute = path || [];
        this.activeSource = source;
        this.activeDest = destination;

        if (!this.gMap) return;

        // Reset all edges and nodes
        const edges = this.gMap.querySelectorAll('.map-edge');
        edges.forEach(e => e.classList.remove('active-route'));

        const nodes = this.gMap.querySelectorAll('.map-node');
        nodes.forEach(n => {
            n.classList.remove('active-start', 'active-dest', 'active-path');
        });

        if (!path || path.length === 0) return;

        // Highlight nodes along the path
        path.forEach((locName, idx) => {
            const nodeEl = this.gMap.querySelector(`.map-node[data-name="${CSS.escape(locName)}"]`);
            if (nodeEl) {
                if (idx === 0) {
                    nodeEl.classList.add('active-start');
                } else if (idx === path.length - 1) {
                    nodeEl.classList.add('active-dest');
                } else {
                    nodeEl.classList.add('active-path');
                }
            }
        });

        // Highlight edges between path nodes
        for (let i = 0; i < path.length - 1; i++) {
            const u = path[i];
            const v = path[i + 1];

            edges.forEach(edge => {
                const s = edge.getAttribute('data-source');
                const d = edge.getAttribute('data-dest');
                if ((s === u && d === v) || (s === v && d === u)) {
                    edge.classList.add('active-route');
                }
            });
        }
    },

    clearRoute() {
        this.highlightRoute([], null, null);
        const popover = document.getElementById('map-popover');
        if (popover) popover.style.display = 'none';
    },

    async showNodePopover(loc, x, y) {
        this.selectedLocationName = loc.name;
        let popover = document.getElementById('map-popover');
        if (!popover) {
            popover = document.createElement('div');
            popover.setAttribute('id', 'map-popover');
            popover.className = 'map-popover';
            const wrapper = document.querySelector('.map-canvas-wrapper');
            if (wrapper) wrapper.appendChild(popover);
        }

        popover.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <span class="loc-cat-badge">${App.categoryLabel(loc.category)}</span>
                <button onclick="document.getElementById('map-popover').style.display='none'" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.1rem;">&times;</button>
            </div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.2rem;">${App.escapeHtml(loc.name)}</h4>
            <p class="map-location-block">${App.escapeHtml(loc.block || 'Campus')} · ${App.escapeHtml(loc.floor || 'Ground')}</p>
            <p class="map-location-description">${App.escapeHtml(loc.description || 'A place on the KIET campus.')}</p>
            <p class="map-walk-time">Select Get Directions to see walking time.</p>
            <div class="map-popover-actions">
                <button class="btn-primary" onclick="App.setNavDestination('${loc.name.replace(/'/g, "\\'")}'); App.handleCalculateRoute()">Get Directions</button>
                <button class="btn-secondary" onclick="App.setNavSource('${loc.name.replace(/'/g, "\\'")}')">Start here</button>
            </div>
        `;
        popover.style.display = 'block';

        const source = document.getElementById('nav-source-select')?.value;
        if (source && source !== loc.name) {
            const estimate = await Api.findRoute(source, loc.name, 'BFS');
            if (this.selectedLocationName === loc.name && estimate.found) {
                const walkingTime = popover.querySelector('.map-walk-time');
                if (walkingTime) walkingTime.textContent = `About ${estimate.estimatedMinutes} min walk from ${source}`;
            }
        }
    }
};
