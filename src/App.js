import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import ss from "./App.module.scss"

function App() {
  return (
    <div className={ss.bg}>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </div>
  );
}

export default App;
