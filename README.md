# Flow Chart App

A modern, interactive flow chart application built with Vue 3, featuring comprehensive node creation, editing, and management capabilities with a focus on user experience, accessibility, and performance.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)
- [Usage Guide](#usage-guide)
- [API Integration](#api-integration)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Testing Strategy](#testing-strategy)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

## ✨ Features

### Core Functionality
- **Interactive Flow Chart Canvas**: Visualize and manipulate nodes using vue-flow library with smooth animations
- **Node Management**: Create, edit, and delete nodes with different types
- **Draggable Nodes**: Move nodes freely across the canvas with child nodes moving together
- **Node Connections**: Connect nodes by dragging from source handle to target handle
- **Undo/Redo**: Full history management for node moves and edits with keyboard shortcuts
- **URL-based Navigation**: Direct linking to specific nodes via `/node/:id` route

### Node Types
- **Send Message**: Manage text messages and file attachments with preview support
- **Add Comments**: Add and edit internal comments
- **Business Hours**: Configure business hours with time picker and timezone support
- **Trigger**: Initial trigger nodes for workflow initiation
- **Connectors**: Success/Failure connectors for business hours branching (read-only)

### User Experience
- **Keyboard Accessibility**: Full keyboard navigation support (arrow keys, Enter, Space, Escape)
- **Visual Feedback**: Focus indicators, hover effects, and smooth transitions
- **Responsive Design**: Works across different screen sizes
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: Graceful error handling with fallback mechanisms

### Developer Experience
- **Type Safety**: Comprehensive validation for all input fields
- **Code Organization**: Well-structured components, utilities, and composables
- **Unit Tests**: Comprehensive test coverage for utilities and transformers
- **Modern Tooling**: Vite for fast development and optimized builds

## 🛠 Tech Stack

### Core Framework
- **Vue 3** (v3.4.21): Progressive JavaScript framework with Composition API
- **Vite** (v5.1.6): Next-generation frontend build tool for fast development

### State Management & Routing
- **Pinia** (v2.1.7): Official Vue state management library
- **Vue Router** (v4.3.0): Official router for Vue.js

### UI Libraries
- **Vue Flow** (v1.48.0): Flow chart visualization library
  - `@vue-flow/core`: Core flow chart functionality
  - `@vue-flow/background`: Background pattern component
  - `@vue-flow/controls`: Zoom and fit view controls

### Data Management
- **TanStack Query (Vue Query)** (v5.28.0): Powerful data synchronization for Vue
- **Axios** (v1.6.7): HTTP client for API requests

### Utilities
- **date-fns** (v3.3.1): Modern JavaScript date utility library
- **uuid** (v9.0.1): UUID generation for unique identifiers

### Testing
- **Vitest** (v1.3.1): Fast unit test framework
- **@vue/test-utils** (v2.4.6): Utilities for testing Vue components
- **jsdom** (v24.0.0): DOM implementation for Node.js

## 📦 Prerequisites

- **Node.js**: Version 18 or higher
- **Package Manager**: npm, yarn, or pnpm
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Vue-Test
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional):
   ```bash
   # Create .env file in the root directory
   # See Environment Variables section below
   ```

## 🔧 Environment Variables

The application uses environment variables for API configuration. Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=https://respond-io-fe-bucket.s3.ap-southeast-1.amazonaws.com
VITE_API_PAYLOAD_PATH=/candidate-assessments/payload.json
```

### Environment Variable Details

- **`VITE_API_BASE_URL`**: Base URL for the API endpoint
  - Default: `https://respond-io-fe-bucket.s3.ap-southeast-1.amazonaws.com`
  - Used in both development (via proxy) and production

- **`VITE_API_PAYLOAD_PATH`**: Path to the payload JSON file
  - Default: `/candidate-assessments/payload.json`
  - Combined with `VITE_API_BASE_URL` to form the complete API URL

**Note**: 
- The `.env` file is gitignored and should not be committed to version control
- Environment variables must be prefixed with `VITE_` to be accessible in the browser
- If variables are not set, the application uses default values from `src/constants/api.js`

## 💻 Development

Start the development server:

```bash
npm run dev
```

The application will be available at:
- **Local**: `http://localhost:5173`
- **Network**: `http://0.0.0.0:5173` (accessible from other devices on the same network)

### Development Features

- **Hot Module Replacement (HMR)**: Instant updates without page refresh
- **Proxy Configuration**: Automatic CORS handling via Vite proxy in development
- **Source Maps**: Easy debugging with original source code mapping
- **Fast Refresh**: Preserves component state during development

### Development Server Configuration

The development server is configured with:
- **Host**: `0.0.0.0` (accessible from network)
- **Proxy**: `/api/payload` → configured API endpoint (handles CORS)
- **Auto-reload**: Enabled for file changes

## 🏗 Building for Production

### Build

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` directory, optimized for:
- **Code splitting**: Automatic chunk splitting for optimal loading
- **Tree shaking**: Unused code elimination
- **Minification**: JavaScript and CSS minification
- **Asset optimization**: Image and asset optimization

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

This serves the `dist/` directory using Vite's preview server.

## 🧪 Testing

### Run Tests

Run all unit tests:

```bash
npm test
```

### Test with UI

Run tests with interactive UI:

```bash
npm run test:ui
```

### Test Coverage

Generate and view test coverage report:

```bash
npm run test:coverage
```

### Test Structure

Tests are located alongside source files:
- `src/utils/helpers.test.js`: Tests for utility functions
- `src/utils/transformers.test.js`: Tests for data transformers

## 📁 Project Structure

```
Vue-Test/
├── src/
│   ├── api/                    # API service layer
│   │   └── payloadService.js   # Payload fetching and updating
│   ├── components/             # Vue components
│   │   ├── nodes/              # Custom node components
│   │   │   └── CustomNode.vue # Reusable node component
│   │   ├── FlowChartCanvas.vue # Main canvas component
│   │   ├── CreateNodeDialog.vue # Node creation dialog
│   │   └── NodeDetailsDrawer.vue # Node editing drawer
│   ├── composables/            # Vue composables
│   │   └── usePayloadQuery.js  # Vue Query integration
│   ├── constants/              # Application constants
│   │   └── api.js              # API endpoint constants
│   ├── router/                 # Vue Router configuration
│   │   └── index.js            # Route definitions
│   ├── stores/                 # Pinia stores
│   │   └── flowChartStore.js   # Main application store
│   ├── utils/                  # Utility functions
│   │   ├── helpers.js          # General helpers (validation, formatting)
│   │   ├── helpers.test.js     # Helper function tests
│   │   ├── transformers.js    # Data transformation utilities
│   │   └── transformers.test.js # Transformer tests
│   ├── views/                  # Page components
│   │   └── FlowChartView.vue   # Main flow chart view
│   ├── test/                   # Test configuration
│   │   └── setup.js            # Vitest setup and mocks
│   ├── App.vue                 # Root component
│   ├── main.js                 # Application entry point
│   ├── style.css               # Global styles
│   └── vue-flow.css            # Vue Flow custom styles
├── .env                        # Environment variables (gitignored)
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## 🎨 Design Decisions

### State Management Architecture

**Separation of Concerns**:
- **Pinia Store** (`flowChartStore.js`): Manages local application state
  - Node selection
  - UI state (loading, dialogs)
  - History management (undo/redo)
  - Node operations (create, update, delete, position updates)
  
- **Vue Query** (`usePayloadQuery.js`): Handles server state
  - Data fetching with caching
  - Automatic refetching strategies
  - Optimistic updates
  - Error handling

**Benefits**:
- Clear separation between client and server state
- Better testability
- Easier to reason about data flow
- Optimized caching and synchronization

### Data Flow

```
API (payload.json)
    ↓
Vue Query (usePayloadQuery)
    ↓
Pinia Store (setPayloadData)
    ↓
Transformers (transformPayloadToFlowData)
    ↓
Vue Flow (nodes & edges)
    ↓
User Interactions
    ↓
Store Updates
    ↓
Vue Query Mutations
```

### Component Architecture

**Hierarchical Component Structure**:

1. **FlowChartView** (View Layer)
   - Main container component
   - Manages toolbar, canvas, and dialogs
   - Handles routing and dialog state
   - Keyboard shortcuts for undo/redo

2. **FlowChartCanvas** (Canvas Layer)
   - Integrates Vue Flow library
   - Handles node/edge change events
   - Manages keyboard navigation
   - Provides keyboard navigation context to child nodes

3. **CustomNode** (Node Layer)
   - Reusable node component
   - Type-specific rendering
   - Keyboard accessibility
   - Handles node clicks and focus

4. **NodeDetailsDrawer** (Editing Layer)
   - Type-specific editing interfaces
   - Form validation
   - File upload handling
   - Business hours time picker

5. **CreateNodeDialog** (Creation Layer)
   - Node creation form
   - Input validation
   - Type selection

### Routing Strategy

**URL-based Navigation**:
- Main route (`/`): Flow chart canvas
- Node details route (`/node/:id`): Opens drawer for specific node

**Benefits**:
- Direct linking to specific nodes
- Browser back/forward navigation
- Shareable URLs
- Better UX for deep linking

### Validation Strategy

**Client-side Validation**:
- All input fields have validation functions
- Validation functions extracted to `utils/helpers.js` for reusability
- Real-time validation on blur events
- Type checking to prevent runtime errors

**Validation Rules**:
- Title: Required, max 100 characters
- Description: Optional, max 500 characters
- Comment: Required, max 1000 characters
- Text Message: Optional, max 2000 characters

### Accessibility Features

**Keyboard Navigation**:
- **Arrow Keys**: Navigate between nodes
- **Enter/Space**: Open node details drawer
- **Escape**: Close dialogs/drawers
- **Tab**: Navigate through form fields
- **Ctrl+Z / Cmd+Z**: Undo
- **Ctrl+Y / Cmd+Y**: Redo

**ARIA Support**:
- Proper ARIA labels and roles
- Screen reader support
- Focus management
- Keyboard event handling

### Performance Optimizations

1. **Computed Properties**: Derived state computed only when dependencies change
2. **Vue 3 Reactivity**: Efficient re-renders with fine-grained reactivity
3. **Query Caching**: Vue Query caches API responses, reducing unnecessary requests
4. **Debounced Updates**: Node position updates batched during dragging
5. **Lazy Loading**: Components loaded on demand
6. **Code Splitting**: Automatic code splitting by Vite

### Node Dragging Implementation

**Parent-Child Movement**:
- When a parent node is dragged, all child nodes move together
- Original positions saved at drag start
- Delta calculation for relative movement
- Recursive child node tracking

**History Management**:
- Position updates batched during drag
- Single history entry added when drag ends
- Prevents cluttering undo/redo history

### Error Handling

**Graceful Degradation**:
- API errors return empty array instead of crashing
- CORS errors handled via proxy in development
- Validation errors displayed inline
- Console logging for debugging

## 📖 Usage Guide

### Creating a Node

1. Click the **"+ Create New Node"** button in the toolbar
2. Fill in the form:
   - **Title** (required): Enter a descriptive title
   - **Description** (optional): Add a description
   - **Type of Node** (required): Select from:
     - Send Message
     - Add Comments
     - Business Hours
3. Click **"Create Node"**
4. The new node will appear on the canvas

### Editing a Node

1. **Click** on any node in the canvas, OR
2. **Navigate** to `/node/:id` in the URL, OR
3. **Use keyboard**: Focus a node and press Enter/Space
4. The details drawer will open on the right
5. Edit the fields as needed
6. For **Send Message** nodes:
   - Add/remove text messages
   - Upload/remove attachments (images show preview)
7. For **Add Comments** nodes:
   - Edit comment text
8. For **Business Hours** nodes:
   - Configure time ranges for each day
   - Select timezone
9. Click **"Save Changes"** to persist updates

### Deleting a Node

1. Open the node details drawer
2. Scroll to the bottom
3. Click the **"Delete Node"** button
4. The node and all its child nodes will be removed

### Moving Nodes

- **Click and drag** any node to reposition it
- **Child nodes** automatically move with their parent
- Position is automatically saved
- Use **Undo** to revert position changes

### Connecting Nodes

1. **Hover** over a node to see connection handles (blue circles)
2. **Click and drag** from the **bottom handle** (source) of one node
3. **Drag** to the **top handle** (target) of another node
4. Release to create the connection
5. Connections create parent-child relationships

**Removing Connections**:
- Select the edge (connection line) and press **Delete**
- Or right-click the edge and select delete

### Zoom and Navigation

- **Zoom Controls**: Use the controls in the top-right corner
  - Zoom In: `Ctrl/Cmd + Plus`
  - Zoom Out: `Ctrl/Cmd + Minus`
  - Fit View: Automatically fits all nodes in view
- **Pan**: Click and drag the canvas background
- **Mouse Wheel**: Zoom in/out with scroll wheel

## 🔌 API Integration

### API Endpoint

The application fetches data from:
```
https://respond-io-fe-bucket.s3.ap-southeast-1.amazonaws.com/candidate-assessments/payload.json
```

### API Service

Located in `src/api/payloadService.js`:

- **`fetchPayload()`**: Fetches payload data from API
  - Uses proxy in development (handles CORS)
  - Uses direct URL in production
  - Returns empty array on error

- **`updatePayload(data)`**: Updates payload data
  - Currently simulates API call (300ms delay)
  - In production, would be a PUT/PATCH request

### Proxy Configuration

In development, Vite proxy handles CORS:
- Request to `/api/payload` → proxied to actual API URL
- Configured in `vite.config.js`

### Payload Structure

Expected payload format:
```json
[
  {
    "id": 1,
    "parentId": -1,
    "type": "trigger",
    "name": "Node Name",
    "description": "Node description",
    "data": {
      // Type-specific data
    }
  }
]
```

## ⌨️ Keyboard Shortcuts

### Global Shortcuts
- **`Ctrl+Z` / `Cmd+Z`**: Undo last action
- **`Ctrl+Y` / `Cmd+Y`**: Redo last action
- **`Escape`**: Close drawer/dialog

### Canvas Navigation
- **`Arrow Keys`**: Navigate between nodes
- **`Enter` / `Space`**: Open node details drawer (when node is focused)
- **`Tab`**: Focus next node

### Node Interaction
- **`Enter` / `Space`**: Open node details (when node is focused)
- **`Escape`**: Close node details drawer

## 🧪 Testing Strategy

### Current Test Coverage

**Unit Tests**:
- ✅ `helpers.test.js`: Validation and utility functions
- ✅ `transformers.test.js`: Data transformation logic

**Test Files**:
- `src/utils/helpers.test.js`: Tests for all helper functions
- `src/utils/transformers.test.js`: Tests for payload transformation

### Testing Utilities

**Test Setup** (`src/test/setup.js`):
- Mocks Vue Flow components
- Configures Vitest environment
- Sets up JSDOM for DOM testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Coverage Goals

- ✅ Utility functions: 100% coverage
- ✅ Transformers: Core transformation logic tested
- 🔄 Components: Unit tests for critical components (planned)
- 🔄 Store: State management logic tests (planned)
- 🔄 Integration: End-to-end user workflows (planned)

## 🐛 Troubleshooting

### Common Issues

**1. CORS Errors in Development**
- **Solution**: The Vite proxy should handle this automatically
- Check that `vite.config.js` has the proxy configuration
- Verify `.env` file has correct API URLs

**2. Nodes Not Dragging**
- **Solution**: Ensure nodes are not set to `draggable: false`
- Check browser console for errors
- Verify Vue Flow is properly initialized

**3. Child Nodes Not Moving with Parent**
- **Solution**: Check that `getAllChildNodeIds` is working correctly
- Verify parent-child relationships in payload data
- Check browser console for errors

**4. API Not Loading**
- **Solution**: Check network tab in browser DevTools
- Verify API URL in `.env` file
- Check if API endpoint is accessible
- Application will show empty canvas if API fails

**5. Tests Not Running**
- **Solution**: Ensure all dependencies are installed (`npm install`)
- Check that `src/test/setup.js` exists
- Verify Vitest configuration in `vite.config.js`

### Debug Mode

Enable verbose logging:
- Open browser DevTools Console
- Check for error messages
- Network tab shows API requests/responses

## 🚀 Future Enhancements

### Planned Features
- [ ] **Component Tests**: Unit tests for Vue components
- [ ] **Store Tests**: Comprehensive Pinia store testing
- [ ] **Integration Tests**: End-to-end user workflow tests
- [ ] **CI/CD Pipeline**: Automated testing and deployment
- [ ] **Export/Import**: Save and load flow charts
- [ ] **Node Templates**: Pre-configured node templates
- [ ] **Collaborative Editing**: Real-time multi-user editing
- [ ] **Visual History**: Timeline view of undo/redo history
- [ ] **Node Search**: Search and filter nodes
- [ ] **Custom Node Types**: Plugin system for custom node types
- [ ] **Performance Monitoring**: Performance metrics and optimization
- [ ] **Accessibility Audit**: Comprehensive accessibility improvements

### Technical Improvements
- [ ] TypeScript migration for type safety
- [ ] Storybook for component documentation
- [ ] E2E testing with Playwright or Cypress
- [ ] Performance profiling and optimization
- [ ] Bundle size optimization
- [ ] PWA support for offline functionality

---

**Built with ❤️ using Vue 3 and modern web technologies**
