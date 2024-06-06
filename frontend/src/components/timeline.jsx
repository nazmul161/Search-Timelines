import IconMapper from "./iconmapper";
import { useState, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { fontWeight } from "@mui/system";
import { saveQueryOnSearch, getDetails } from "./functions";
import DesktopMacIcon from '@mui/icons-material/DesktopMac';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { Scrollbars } from 'react-custom-scrollbars-2';

const style = {
  query: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: "5px 5px",
    border: "2px solid black",
    borderRadius: "4px",
    cursor: "pointer",
    // textDecoration: "underline",
    textDecorationColor: "black",
  },
  items: {
    position: "relative",
    margin: "0px 0px 0px 10px",
    padding: "0px 5px 25px 15px",
    borderLeft: "2px solid black",
    cursor: "pointer",
  },
  itemsRemoved: {
    position: "relative",
    margin: "0px 0px 0px 10px",
    padding: "0px 5px 25px 15px",
    borderLeft: "2px solid black",
    textDecoration: "line-through",
  },
  items_time: {
    display: "inline-block",
    float: "right",
    fontSize: "12px",
    backgroundColor: "white",
    fontWeight: "bold",
    color: "#59b6c7",
  },
  items_icon: {
    backgroundColor: "white",
    display: "inline-block",
    position: "absolute",
    left: -9,
    color: "#59b6c7",
    cursor: "pointer",
  },
};

export default function UserTimeline({ queries, data, setPageLoading, setShowDetails,setDetails }) {

  const getSearchResult = async (searchTerm) => {
    localStorage.setItem("searchTerm", searchTerm);
    if (queries.length !== 0){
      const queryUser = queries[0].userId;
      try{
        await saveQueryOnSearch(searchTerm, queryUser, localStorage.getItem("searchTopic"));
      }catch(e){
        console.log(e);
      }
    }
    window.location = "/results";
  };

  function getDeviceIcon(os) {
    let tag = os
    if(os=='Windows') {
      tag = <DesktopMacIcon fontSize="small"/>
    } else if(os=='Android') {
      tag = <PhoneIphoneIcon fontSize="small"/>
    }
    return tag;
  }

  return (
    <div style={{position: 'sticky', top: '0'}}>
      {queries.length == 0 ? (
        <h5>No queries found for this topic</h5>
      ) : (
        
        <div
          style={{
            backgroundColor: "lightblue",
            padding: "0px 5px 10px 5px",
            margin: "0px 0px 0px 10px",
            border: "2px solid DarkGrey",
            borderRadius: "10px",
            // overflowY: 'scroll',
            height: "97.5vh",
            cursor: "arrow"
          }}
        >
          <Scrollbars>
          <h3>Search Topic: {queries[0].searchTopic ?? localStorage.getItem("searchTopic")}</h3>
          {queries.map((query) => {
            console.log(queries);
            const initialSearch = format(new Date(query.createdAt), "PP p");
            //const latestSearch = format(new Date(query.updatedAt), "PP p");
            var previousDate = null;
            return (
              <div
                key={query._id}
                style={{
                  backgroundColor: "white",
                  padding: "20px 10px 30px 10px",
                  margin: "20px 5px 0px 4px",
                  border: "2px solid DarkGrey",
                  borderRadius: "10px",
                }}
              >
                <h4 style={{borderBottom: "1px solid #dedede", margin: "5px 0px 10px"}}>{format(new Date(query.createdAt), 'PP')}</h4>
                {query.documents.map((doc) => {
                  // if (
                  //   format(new Date(previousDate), "PP") ==
                  //   format(new Date(doc.updatedAt), "PP")
                  // ) {
                    console.log("p",doc.docdata.Title);
                    console.log("previous date", format(new Date(previousDate), "PP"));
                    console.log("updatedate",format(new Date(doc.updatedAt), "PP"));
                    var timechanger = format(new Date(doc.createdAt), "p");
                  // } else {
                  //   console.log("ppp",doc.docdata.Title);
                  //   console.log("previous date", format(new Date(previousDate), "PP"));
                  //   console.log("updatedate",format(new Date(doc.updatedAt), "PP"));
                  //   var timechanger = format(new Date(doc.updatedAt), "PP p");
                  // }
                  previousDate = doc.updatedAt;
                  return (
                    <div style={style.items} key={doc._id}>
                      <div style={style.items_icon}>
                        <IconMapper format={doc.docdata.Format} />
                      </div>
                      {/* {doc.docdata.Title}{" "} */}
                      {doc.isRemoved ? (
                        <span 
                        onClick={() =>
                          getDetails(
                            doc.ControlNumber,
                            setPageLoading,
                            setShowDetails,
                            setDetails
                          )
                        }
                        style={{ textDecoration: "line-through" }}>
                          {doc.docdata.Title}{" "}
                        </span>
                      ) : (
                        <span
                        onClick={() =>
                          getDetails(
                            doc.ControlNumber,
                            setPageLoading,
                            setShowDetails,
                            setDetails
                          )
                        }>{doc.docdata.Title} </span>
                      )}
                      <div style={style.items_time}>{timechanger}</div>
                    </div>
                  );
                })}
                <div style={{ padding: "0px 0px" }}>
                  <div
                    style={style.query}
                    onClick={() =>{
                       getSearchResult(query.query);
                         
                    }}
                    
                  >
                    <span style={{display:'flex',alignItems:'center'}}>
                    <SearchIcon fontSize="small"> </SearchIcon>
                    {query.query} 
                    </span>
                    {/* <span style={{float:'right'}}>{getDeviceIcon(query.os)}</span> */}
                  </div>
                  {/* {initialSearch !== latestSearch ?
                  <>
                   <div style={style.items_time}>Latest query at: {latestSearch}</div><br/>
                    <div style={style.items_time}>Query initiated at: {initialSearch}</div>
                   
                  </>: */}
                    <div style={style.items_time}> {initialSearch}</div>
                  {/* } */}
                </div>
              </div>
            );
          })}
          </Scrollbars>
        </div>
      )}
    </div>
  );
}
