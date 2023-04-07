import './App.css';
import Home from "./pages/home";
import EditorPage from "./pages/editorpage";
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
function App()
 {
  return (
          <div>
            <Toaster position='top-right' toastOptions=
            {{
              success:{
                theme:{
                  primary: "#4aed88",
                },
              },
            }}
            />
          
         <BrowserRouter>
                <Routes>
                   <Route path="/" element={<Home />}></Route>
                   <Route path='/editor/:roomid' element={<EditorPage />}></Route>
                </Routes>
         </BrowserRouter>
         </div>
   
  );
}

export default App;
