import logo from './logo.svg';
import './App.css';
import Game from './components/Game';
import packageJson from '../package.json';

function App() {
  return (
    <div className="App">
      <Game />
      <footer style={{marginTop: '2rem', fontSize: '0.9rem', color: '#888'}}>
        Version: {packageJson.version} &mdash; {new Date().toLocaleDateString()}
      </footer>
    </div>
  );
}

export default App;
