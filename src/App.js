import { HashRouter } from 'react-router-dom';
import Home from './Home';
import ss from "./App.module.scss"

function App() {
  return (
    <div className={ss.bg}>
      <HashRouter>
        <Home />
      </HashRouter>
    </div>
  );
}

export default App;
