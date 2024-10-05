import { HashRouter } from 'react-router-dom';
import ss from "./App.module.scss";
import Home from './Home';

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
