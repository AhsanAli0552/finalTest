import React, { useContext } from 'react';
import NotesList from '../NotesList';
import { AuthContext } from '../../../context/AuthContext';
import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { Link } from 'react-router-dom';
const Home = () => {
  const { user } = useContext(AuthContext)
  return (
    <mian className="frontend">
  <div className="container-fluid p-4" style={{ backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
    <header className="d-flex justify-content-between align-items-center mb-4">
      <h1 style={{ color: '#343a40' }}>Hi, {user.fullName}</h1>
      <Link to="/Add" className="btn btn-success">
        <PlusOutlined />
        <span>Add Note</span>
      </Link>
    </header>

    <div className="row">
      <aside className="col-md-3">
        <div className="card mb-4" style={{ backgroundColor: '#007bff', color: 'white' }}>
          <div className="card-body">
            <h5 className="card-title">Navigation</h5>
            <ul className="list-group">
              <li className="list-group-item" style={{ backgroundColor: '#0056b3' }}>
                <Link to="/" style={{ color: 'white' }}>Home</Link>
              </li>
              <li className="list-group-item" style={{ backgroundColor: '#0056b3' }}>
                <Link to="/Add" style={{ color: 'white' }}>Add Note</Link>
              </li>
              <li className="list-group-item" style={{ backgroundColor: '#0056b3' }}>
                <Link to="/Settings" style={{ color: 'white' }}>Settings</Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <main className="col-md-9">
        <div className="input-group mb-4">
          <span className="input-group-text" style={{ backgroundColor: '#e9ecef' }}>
            <SearchOutlined />
          </span>
          <input type="text" className="form-control" placeholder="Search note" />
        </div>

        <section>
          <h5 className="fw-bold" style={{ color: '#007bff' }}>All Notes</h5>
          <div className="row">
            <NotesList />
          </div>
        </section>
      </main>
    </div>
  </div>
</mian>

  
  );
};

export default Home;
