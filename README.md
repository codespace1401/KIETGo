# KIETGo — Smart Campus Navigation
> Find your way. Go anywhere.

> **Campus data status:** The runtime graph loads from `backend-java/src/main/resources/campus-data.json`. Its current entries identify an Apex Institute example campus and are not verified KIET Korangi locations. The frontend reads locations through the existing backend API and does not duplicate the dataset. Replace the runtime resource with verified KIET data before using this as an official campus guide. The root `data/campus-data.json` is an identical existing copy.

## 🚀 Live Demo
👉 [Open Live Demo](https://campus-navigation-chatbot-xeu0.onrender.com)

An intelligent campus navigation and wayfinding web application designed to help new students, faculty, and visitors explore lecture halls, research laboratories, academic departments, administrative offices, libraries, hostels, and dining facilities.

The system combines **Artificial Intelligence (AI Agent)**, **Advanced Data Structures & Algorithms (ADSA Graph Pathfinding with BFS & DFS)**, **Java Object-Oriented Programming (OOPJ Spring Boot)**, and **Python Rule-Based NLP Intent Classification** into a unified, responsive web platform.

---

## 🏛️ Academic Pillars & Technology Mapping

This project explicitly demonstrates core concepts from four key academic subjects:

| Academic Subject | Implementation in Project | Key Concepts Demonstrated |
| :--- | :--- | :--- |
| **Artificial Intelligence (AI)** | Intelligent Agent Query Handler & Intent Classifier | Multi-intent classification, Entity extraction, Dialogue state management, Knowledge grounding |
| **ADSA (Graph Algorithms)** | Campus Topology Graph, BFS Shortest Path, DFS Traversal | Graph representation (Adjacency List), Breadth-First Search (Queue FIFO), Depth-First Search (Stack LIFO), $O(V+E)$ complexity |
| **OOPJ (Java OOP)** | Spring Boot 3 REST Backend | Strategy Pattern (`PathFinder`), Encapsulation (`CampusGraph`, `CampusLocation`), Domain Models, Service Layer Architecture |
| **Python** | NLP Intent Classification Microservice | Text normalization, Regular expressions, REST API server, Multi-threaded HTTP dispatch |

---

## 🚀 Key Features

* 💬 **Campus AI Assistant (Chatbot):** Natural conversational query handling with intent detection, entity recognition, suggested question chips, and interactive in-chat route cards.
* 🧭 **Graph Pathfinding Navigator:** Dual-algorithm routing engine with **BFS (Guaranteed Shortest Path)** and **DFS (Deep Graph Traversal)**.
* 🗺️ **Interactive Schematic Campus Map:** High-resolution vector SVG map with zoom, pan, category-coded nodes, interactive popovers, and animated route highlighting.
* 📍 **Comprehensive Campus Directory:** Searchable directory of 27 campus locations with floor, block, operating hours, and facilities.
* 🔬 **ADSA Algorithm Visualizer & Comparator:** Side-by-side empirical comparison between BFS and DFS path lengths, step hops, and complexity metrics.
* ⚙️ **Campus Graph Admin Suite:** Live graph viewer with dynamic registration of new vertices (locations) and edges (walkways).
* 🛡️ **Fault-Tolerant Microservice Fallback:** If the Python service is offline, Java automatically activates an internal rule-based classifier without interrupting the user experience.

---

## 🏗️ System Architecture

```text
                           STUDENT / USER
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   Modern Web UI (SPA) │
                     │   HTML5 / CSS3 / JS   │
                     │   Interactive SVG Map │
                     └───────────┬───────────┘
                                 │ HTTP REST (Port 8080)
                                 ▼
                     ┌───────────────────────┐
                     │  Java Spring Boot 3   │
                     │  (Intelligent Agent)  │
                     └─────┬───────────┬─────┘
                           │           │
           POST /classify  │           │ Graph Operations
      (HTTP REST Port 5000)│           │ (BFS / DFS Traversal)
                           ▼           ▼
        ┌─────────────────────┐     ┌───────────────────────┐
        │  Python Intent      │     │  Campus Graph Model   │
        │  Classifier Service │     │  • 27 Vertices (Nodes)│
        │  (Keyword NLP)      │     │  • 39 Walkways (Edges)│
        └─────────────────────┘     └───────────────────────┘
```

---

## 📁 Project Structure

```text
Team Project 30/
├── backend-java/                              # Java Spring Boot Backend Layer
│   ├── pom.xml                                # Maven Dependencies & Build Config
│   ├── Dockerfile                             # Multi-stage Docker Container
│   └── src/
│       ├── main/
│       │   ├── java/com/campusnav/
│       │   │   ├── CampusNavApplication.java  # Main Application Entry Point
│       │   │   ├── algorithm/                 # ADSA Pathfinding Algorithms
│       │   │   │   ├── PathFinder.java        # Strategy Interface
│       │   │   │   ├── BFSPathFinder.java     # Breadth-First Search (Shortest Path)
│       │   │   │   └── DFSPathFinder.java     # Depth-First Search (Traversal)
│       │   │   ├── client/                    # Python Microservice Client
│       │   │   │   └── PythonClassifierClient.java # REST Client + Java Fallback
│       │   │   ├── config/                    # Spring Configuration & CORS
│       │   │   │   ├── AppConfig.java
│       │   │   │   └── CorsConfig.java
│       │   │   ├── controller/                # REST Controllers
│       │   │   │   ├── ChatController.java
│       │   │   │   ├── NavigationController.java
│       │   │   │   ├── LocationController.java
│       │   │   │   ├── AdminController.java
│       │   │   │   └── HealthController.java
│       │   │   ├── graph/                     # ADSA Graph Encapsulation
│       │   │   │   └── CampusGraph.java
│       │   │   ├── model/                     # Domain & DTO Classes
│       │   │   │   ├── CampusLocation.java
│       │   │   │   ├── GraphNode.java
│       │   │   │   ├── GraphEdge.java
│       │   │   │   ├── LocationCategory.java
│       │   │   │   ├── NavigationRequest.java
│       │   │   │   ├── NavigationResponse.java
│       │   │   │   ├── ChatRequest.java
│       │   │   │   ├── ChatResponse.java
│       │   │   │   └── IntentResult.java
│       │   │   └── service/                   # Business Logic & Orchestration
│       │   │       ├── ChatbotService.java    # Intelligent Agent Orchestrator
│       │   │       ├── NavigationService.java
│       │   │       ├── LocationService.java
│       │   │       └── ResponseGenerator.java
│       │   └── resources/
│       │       ├── application.properties
│       │       ├── campus-data.json           # Campus Graph Dataset
│       │       └── static/                    # Frontend Web Assets
│       │           ├── index.html             # Single Page Application UI
│       │           ├── css/style.css          # Design System & Styling
│       │           └── js/
│       │               ├── api.js             # REST API Client
│       │               ├── map.js             # SVG Map Engine
│       │               └── app.js             # Frontend Controller
│       └── test/java/com/campusnav/           # JUnit 5 Integration Test Suite
│           └── CampusNavApplicationTests.java
│
├── python-classifier/                         # Python Intent Classifier Layer
│   ├── app.py                                 # Threaded REST API Server (Port 5000)
│   ├── classifier.py                          # Rule-Based NLP Classifier
│   ├── requirements.txt                       # Python Dependencies
│   └── Dockerfile                             # Python Container
│
├── frontend/                                  # Standalone Frontend Source Copy
│   ├── index.html
│   ├── css/style.css
│   └── js/
│
├── data/
│   └── campus-data.json                       # Canonical Campus Graph Dataset
│
├── run_all.bat                                # Windows 1-Click Launch Script
├── run_all.ps1                                # PowerShell 1-Click Launch Script
├── docker-compose.yml                         # Full Multi-Container Compose Config
└── README.md                                  # Complete Technical Documentation
```

---

## 🧠 How Breadth-First Search (BFS) Works

BFS is an uninformed search algorithm that explores a graph level by level. In an unweighted graph where every edge represents 1 unit of hop traversal, **BFS guarantees the shortest path (minimum hops)** between the source and destination.

### Algorithm Steps
1. **Initialize:** Create a `Queue<String>` for FIFO vertex exploration, a `Set<String>` for tracking visited nodes, and a `Map<String, String>` (`parentMap`) to record the predecessor of each explored node.
2. **Enqueue Source:** Mark the start node as visited and push it into the queue.
3. **Exploration Loop:**
   * Dequeue the front vertex `current`.
   * If `current` equals `destination`, terminate search.
   * For each unvisited neighbor $v$ in `graph.getNeighbors(current)`:
     * Mark $v$ as visited.
     * Record `parentMap.put(v, current)`.
     * Enqueue $v$.
4. **Path Reconstruction:** Backtrack from `destination` to `source` using `parentMap` and reverse the list to produce the route sequence.
5. **Metric Calculation:** Accumulate distance in meters and walking time in minutes across the traversed edges.

### Complexity
* **Time Complexity:** $\mathcal{O}(V + E)$ where $V$ is the number of campus locations and $E$ is the number of connecting walkways.
* **Space Complexity:** $\mathcal{O}(V)$ for the queue and visited set.

---

## 🌲 How Depth-First Search (DFS) Works

DFS explores graph branches as deeply as possible before backtracking.

### Algorithm Steps
1. Start at `source` and mark it as visited.
2. Push `source` to the recursive call stack.
3. If `current == destination`, path is found.
4. Recursively visit the first unvisited neighbor.
5. If a dead end is reached, backtrack to the previous branch.

### Academic Comparison (BFS vs DFS)
* **Shortest Path:** BFS guarantees the shortest path in unweighted graphs; DFS does not.
* **Traversal Pattern:** BFS expands in concentric rings (queue); DFS dives down a single branch (stack).
* **Viva Note:** For a query like *Central Library $\rightarrow$ Main Auditorium*, BFS finds the direct 2-step route via Seminar Hall, whereas DFS may traverse 6 intermediate nodes through Block A, Reception, Admin Block, Block B, and Canteen.

---

## 🤖 Python Keyword Intent Classification

The Python microservice normalizes student input and matches key patterns using prioritized regular expressions:

| Intent | Sample Student Query | Matched Regex Pattern | System Action |
| :--- | :--- | :--- | :--- |
| `DIRECTIONS` | *"How do I reach AI Lab from Main Gate?"* | `\b(how (?:do\|can) i (?:reach\|go)\|route\|take me to)\b` | Extracts source & destination, runs BFS pathfinding |
| `TIMING` | *"What are the library timings?"* | `\b(timings?\|time\|hours?\|open\|close\|schedule)\b` | Looks up operating hours for target location |
| `GENERAL` | *"Tell me about the CSE department."* | `\b(tell me about\|what is\|details?\|info about)\b` | Retrieves department overview, floor, and facilities |
| `LOCATION_SEARCH`| *"Where is the canteen?"* | `\b(where is\|locate\|find\|which block)\b` | Returns location block, floor, and "Navigate Here" card |
| `UNKNOWN` | *"Can you sing a song?"* | *(No pattern matched)* | Provides helpful prompt suggestions |

---

## 🔌 REST API Documentation

### 1. Chatbot API
* **Endpoint:** `POST /api/chat`
* **Request:**
  ```json
  {
    "query": "How do I reach the AI lab from Main Gate?",
    "currentLocation": "Main Gate",
    "algorithm": "BFS"
  }
  ```
* **Response:**
  ```json
  {
    "intent": "DIRECTIONS",
    "query": "How do I reach the AI lab from Main Gate?",
    "response": "Here is the shortest route from Main Gate to AI Lab:\n\nMain Gate ➔ Security & Info Kiosk ➔ Reception & Welcome Center ➔ Block A ➔ AI & DS Department ➔ AI Lab\n\n5 steps | ~460 meters | ~7 min walk (via BFS)",
    "source": "Main Gate",
    "destination": "AI Lab",
    "navigationResult": {
      "found": true,
      "algorithm": "BFS",
      "source": "Main Gate",
      "destination": "AI Lab",
      "path": ["Main Gate", "Security & Info Kiosk", "Reception & Welcome Center", "Block A", "AI & DS Department", "AI Lab"],
      "steps": 5,
      "distanceMeters": 460,
      "estimatedMinutes": 7,
      "timeComplexity": "O(V + E)",
      "spaceComplexity": "O(V)"
    },
    "pythonClassifierStatus": "CONNECTED",
    "confidence": 0.95
  }
  ```

### 2. Navigation API
* **BFS Endpoint:** `POST /api/navigation/bfs`
* **DFS Endpoint:** `POST /api/navigation/dfs`
* **Request:**
  ```json
  {
    "source": "Central Library",
    "destination": "Main University Auditorium",
    "algorithm": "BFS"
  }
  ```

### 3. Locations API
* **All Locations:** `GET /api/locations`
* **Search Locations:** `GET /api/locations/search?query=lab`
* **Get by Category:** `GET /api/locations/category/LABORATORY`

### 4. Health API
* **Endpoint:** `GET /api/health`
* **Response:**
  ```json
  {
    "status": "UP",
    "application": "Campus Navigation Chatbot Backend",
    "version": "1.0.0",
    "pythonServiceStatus": "CONNECTED",
    "graphNodes": 27,
    "graphEdges": 39
  }
  ```

---

## 💻 How to Run the Application

### Option 1: 1-Click Launch (Windows)
Double-click `run_all.bat` or execute in PowerShell:
```powershell
.\run_all.ps1
```
This automatically starts both the Python intent classifier (Port 5000) and the Java Spring Boot backend (Port 8080), then opens `http://localhost:8080` in your default browser.

---

### Option 2: Manual Step-by-Step Launch

#### Step 1: Start Python Intent Classifier
```powershell
cd python-classifier
python app.py
```
*Service will start on:* `http://localhost:5000`

#### Step 2: Start Java Spring Boot Backend
In a separate terminal:
```powershell
cd backend-java
mvn spring-boot:run
```
*Web Application will be available at:* `http://localhost:8080`

---

### Option 3: Docker Compose
```bash
docker-compose up --build
```
*Access UI at:* `http://localhost:8080`

---

## 🧪 Verified Test Execution Results

All required test cases have been verified against the live services:

```text
========================================================================================
Test Case 1: Navigation Query (Main Gate -> AI Lab)
  Query: "How do I reach the AI lab from Main Gate?"
  Result:
    • Intent: DIRECTIONS (Confidence: 0.95)
    • Route: Main Gate ➔ Security & Info Kiosk ➔ Reception & Welcome Center ➔ Block A ➔ AI & DS Department ➔ AI Lab
    • Steps: 5 hops | Distance: 460m | Est. Walk: 7 min | Algorithm: BFS O(V+E)
========================================================================================
Test Case 2: Timing Query
  Query: "What are the library timings?"
  Result:
    • Intent: TIMING (Confidence: 0.95)
    • Output: "Central Library is open 8:00 AM - 9:00 PM (Mon-Sat), 10:00 AM - 5:00 PM (Sun)"
========================================================================================
Test Case 3: General Department Information
  Query: "Tell me about the CSE department."
  Result:
    • Intent: GENERAL (Confidence: 0.85)
    • Output: "CSE Department located in Block A, First Floor. Operating Hours: 8:30 AM - 5:00 PM"
========================================================================================
Test Case 4: Location Search
  Query: "Where is the canteen?"
  Result:
    • Intent: LOCATION_SEARCH (Confidence: 0.90)
    • Output: "Central Canteen & Cafeteria located in Dining Complex, Ground & Mezzanine"
========================================================================================
Test Case 5: BFS vs DFS Route Comparison (Library -> Auditorium)
  Result:
    • BFS Route: Central Library ➔ Seminar Hall ➔ Main University Auditorium (2 steps, Optimal)
    • DFS Route: Central Library ➔ Block A ➔ Reception ➔ Admin Block ➔ Block B ➔ Canteen ➔ Auditorium (6 steps)
========================================================================================
Test Case 6: Fallback Resilience
  Action: Stopped Python Microservice
  Result:
    • Java gracefully activates embedded rule-based classifier without throwing 500 errors.
========================================================================================
```

---

## 🎓 Viva Q&A Guide (Examiner Questions & Answers)

**Q1: What is the time complexity of BFS, and why is it preferred over DFS for navigation?**
> **Answer:** BFS has a time complexity of $\mathcal{O}(V + E)$ where $V$ is vertices and $E$ is edges. BFS is preferred because it explores vertices level-by-level in concentric hops, guaranteeing the shortest path in unweighted graphs. DFS explores deeply down a branch and may find a much longer, non-optimal path.

**Q2: How does the Java backend communicate with the Python service?**
> **Answer:** Java uses `java.net.http.HttpClient` to make asynchronous/synchronous HTTP POST requests to `http://localhost:5000/classify` with a JSON payload containing the raw user query. Python processes the text and returns a JSON payload containing the classified intent, confidence score, and matched keyword pattern.

**Q3: What happens if the Python microservice crashes or is not started?**
> **Answer:** The system incorporates a fault-tolerant fallback pattern. `PythonClassifierClient` catches connection exceptions and transparently routes the query to an internal Java regex-based classifier (`fallbackClassify()`), ensuring zero downtime for the student.

**Q4: Which OOP Design Patterns are used in this project?**
> **Answer:**
> 1. **Strategy Pattern:** The `PathFinder` interface allows interchangeable routing strategies (`BFSPathFinder` and `DFSPathFinder`).
> 2. **Encapsulation:** `CampusGraph` hides adjacency list manipulation behind accessor and graph operation methods.
> 3. **Controller-Service-Repository Pattern:** Standard Spring architectural layering separating API endpoints, business logic, and topological storage.

---

## 🔮 Future Enhancements
* Real GPS and compass integration for outdoor tracking.
* Voice-based speech-to-text queries for accessibility.
* Multilingual query support (Telugu, Hindi, English).
* Indoor BLE beacon-based floor-by-floor wayfinding.
* Wheelchair-accessible routing constraints (avoiding stairs).
