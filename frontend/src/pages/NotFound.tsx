import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="home-link">
        Go back to home
      </Link>
        
      <style >{`
        .not-found-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
          padding: 20px;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #333;
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          color: #666;
        }
        .home-link {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          transition: background-color 0.3s;
        }
        .home-link:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default NotFound;