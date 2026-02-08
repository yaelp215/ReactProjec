import React from "react";
type Singal = {
    letter:string;
    // letter: { he: string; en: string };
    language: "en" | "he";
 onClick: (letterToSend: string) => void;
};
export const Singal = (prop:Singal) => {
   const handleClick = () => {
    const letterToSend = prop.language === "he" ? prop.letter.he : prop.letter.en;
    prop.onClick(letterToSend); 
  };
  return (
    <button onClick={handleClick}>
      {prop.language === "he" ? prop.letter.he : prop.letter.en}
    </button>
  );
};