import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import EditPage from './pages/EditPage';
import ListPage from './pages/ListPage';
import ShowPage from './pages/ShowPage';
import AdminPage from './pages/AdminPage';


function App() {

  return(
    <Router>
      <NavBar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={ <HomePage /> } />,
          <Route path="/blogs" element={ <ListPage /> } />,
          <Route path="/Admin" element={ <AdminPage /> } />,
          <Route path="/blogs/create" element={ <CreatePage /> } />,
          <Route path="/blogs/:id/edit" element={ <EditPage /> } />,
          <Route path="/blogs/:id" element={ <ShowPage /> } />,
        </Routes>
      </div>
    </Router>
  );
}

export default App;



         