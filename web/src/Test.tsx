import React from "react";

type Props = {};

const uri =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAQFJREFUSEvtlsERhCAMRcNJmuBuL1ZghxRAMZxtwsELO9kZWDYLAZH1JEcxefyfkEEAgIcbl3iAV9z23oMQaOJn/dXSB8iWC+2hi9aH7ndbGmAUkEsYoKW9atOUYJi4tpdzoAnIWVdS0qUQg5xzIKUs1jenklPOKuRqlJ6A/sfFDQNyLZ6W5BKQXhVMTO3Ecuz7HkdcF1ApBdu2fc3JYGPOzvTbaSB3J7HBpmn6GdjdwNq9wzrmrlAXkINxQ4DGVS1d1xW01mCthXmes82YNk9t/A2ZNMFKqmbo8C6p4tS+D9b6iDLGwLIs0VLsxuM4Tr9AmoGnMxcCHuAoJ2Oe2y19AUJ20AFcI0lUAAAAAElFTkSuQmCC";

export const Test = (props: Props) => {
  const handleOnClick = () => {
    fetch("http://127.0.0.1:5000/inference", {
      method: "POST",
      body: JSON.stringify({
        image: uri,
      }),
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => console.log("YOOOOO"));
  };

  return <button onClick={handleOnClick}>Test</button>;
};
