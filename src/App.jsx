import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({log: true})//to see what dosein the console

function App() {
  
  const [readey, setReadey] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReadey(true);
  };

  const convertToGif = async () => {
    //werite the file to memory
    ffmpeg.FS(
      'writeFile',
      'test.mp4',
      await fetchFile(video)
    );

    //run the FFMpeg command
    await ffmpeg.run( '-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');

    //read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    //create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}));
    setGif(url);
  }

  useEffect(()=>{
    load();
  }, []);


  return readey ? (
    <div className="App container ">
      
      <div className="card mt-5" >
        <div className="card-body">
          <h5 className="card-title">Convert Video to GIF</h5>
            {
            video && <video
                      controls
                      width="250"
                      src={URL.createObjectURL(video)}
                    ></video>
            }
            <div className="m-3 text-center align-items-center">
            <input className="btn btn-primary" type="file" onChange={(e) => setVideo(e.target.files?.item(0))}/>

            </div>

            <h3 className="card-title"> Result </h3>
            <div className="m-3">
            <button className="btn btn-primary" onClick={()=>convertToGif()}>Convert</button>
            </div>

            {gif && <img src={gif} width="250" />}
        </div>
      </div>

      
      

    </div>
  ):
  (<p> Loading ...</p>);
}

export default App;
