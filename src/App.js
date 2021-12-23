import logo from "./logo.svg";
import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState([]);
  const [cursor, setCursor] = useState(text.length);
  const textRef = useRef(null);

  const onTextClick = element => {
    element.current.focus();
  };
  // console.log(cursor, "cursor");

  const onKeyboardClick = e => {
    switch (e) {
      case "ArrowLeft": {
        cursor > 0 && setCursor(prev => prev - 1);
        break;
      }
      case "ArrowRight": {
        cursor < text.length && setCursor(prev => prev + 1);
        break;
      }
      case "ArrowUp": {
        cursor < 70 && setCursor(0);
        cursor >= 70 && setCursor(prev => prev - 70);
        break;
      }
      case "ArrowDown": {
        text.length - cursor < 70 && setCursor(text.length);
        text.length - cursor >= 70 && setCursor(prev => prev + 70);
        break;
      }
      case "Home": {setCursor(0);break;}
      case "End": {setCursor(text.length);break;}
      case "Backspace": {
        cursor > 0 && setCursor(prev => prev - 1);
        setText([...text.slice(0, cursor - 1), ...text.slice(cursor)]);
        break;
      }
      case "Delete": {
        setText([...text.slice(0, cursor), ...text.slice(cursor + 1)]);
        break;
      }
      default: {
        if (cursor === text.length) {
          setText([...text, e]);
          setCursor(prev => prev + 1);
        } else if (cursor !== text.length) {
          setText([...text.slice(0, cursor), e, ...text.slice(cursor)]);
          setCursor(prev => prev + 1);
        }
        break;
      }
    }
    //console.log(cursor, text, e);
  };

  function saveToPC(str) {
    let blob = new Blob([str], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download =  Date.now() + "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function UploadFile() {
    let file = document.getElementById("uploader").files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
      setText(reader.result.split(""));
      setCursor(reader.result.split("").length);
    };
    reader.onerror = () => {
      console.log(reader.error);
    };
  }

  return (
    <div className="App">
      <div
        id="text"
        onKeyDown={e => onKeyboardClick(e.key)}
        tabIndex={1}
        onClick={() => onTextClick(textRef)}
        ref={textRef}
        className={"text"}
      >
        {console.log(text, "text in App")}
        {text.slice(0, cursor).map((el, index) => (
          <>
            {console.log((index + 1) % 70, index, "calc")}
            {el}
            {(index + 1) % 70 === 0 && <br />}
          </>
        ))}
        |
        {text.slice(cursor).map((el, index) => (
          <>
            {console.log(
              (index + text.slice(0, cursor).length + 1) % 70,
              index,
              "calc"
            )}
            {el}
            {(index + 1 + text.slice(0, cursor).length) % 70 === 0 && <br />}
          </>
        ))}
      </div>
      <button onClick={() => saveToPC(text.join(""))}>Сохранить</button>
      <input onChange={() => UploadFile()} type={"file"} id={"uploader"} />
    </div>
  );
}

export default App;
