import IconMapper from "./iconmapper";
import { useState, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import EditIcon from '@mui/icons-material/Edit';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { saveQueryOnSearch } from "./functions";
import ShowDetailsComponent from "./showdetailscomponent";
import Records from "./records";
import Loading from "./loading";
import { useEffect } from "react";
import Modal from 'react-modal';
import {
  Button, Grid, setRef,
} from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DesktopMacIcon from '@mui/icons-material/DesktopMac';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import {
  getSavedDocsControlNumbers,
  getSearchResult,
  getDetails,
  saveDoc,
  getQueryList,
  editSearchTopic
} from "./functions";
import { useMemo } from "react";
import { Scrollbars } from 'react-custom-scrollbars-2';
const style = {
  query: {
    display: 'flex',
    //justifyContent: 'center',
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
    padding: "0px 5px 60px 15px",
    borderLeft: "5px solid black",
    cursor: "pointer",
  },
  itemsRemoved: {
    position: "relative",
    margin: "0px 0px 0px 10px",
    padding: "0px 5px 25px 15px",
    borderLeft: "2px solid black",
    textDecoration: "line-through",
    cursor: "pointer",
  },
  items_time: {
    display: "inline-block",
    float: "right",
    fontSize: "16px",
    backgroundColor: "white",
    fontWeight: "bold",
    color: "#59b6c7",
  },
  items_icon: {
    fontSize:"30px",
    backgroundColor: "white",
    display: "inline-block",
    position: "absolute",
    left: -17,
    color: "#59b6c7",
  },
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function EnhancedTimeline({ userobj, queries, setRefetchQueries,onResumeCallback, refetchQueries, setHighlightedTopic, ...props }) {

  const [savedDocsList, setSavedDocsList] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showLoginRequiredMessage, setShowLoginRequiredMessage] = useState(0);
  const [pageLoading, setPageLoading] = useState(false);
  const [details, setDetails] = useState(Array());
  const [hack, setHack] = useState(false);
  const [resumeTopicHack, setResumeTopicHack] = useState(localStorage.getItem("searchTopic"));
  const [modalTopic, setModalTopic] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editHack, setEditHack] = useState(false);
  const [topicTitleHack, setTopicTitleHack] = useState(queries[0].searchTopic);
  const [currentTopicRename,setCurrentTopicRename ] = useState(false);
  const [resumeDisabled, setResumeDisabled] = useState(false);

  // const SaveButton = ({ data, onResumeCallback }) => {
  useEffect(() => {
    const searchTerm = localStorage.getItem("searchTerm");
    if (userobj._id != "" && userobj._id != null) {
      getSavedDocsControlNumbers(userobj._id, setSavedDocsList, searchTerm, topicTitleHack);
    }

    // console.log(savedDocsList);
    // console.log("hacked");
  }, [refetchQueries]);

  useEffect(()=>{
    if(editHack){
      console.log(localStorage.getItem("searchTopic"));
      if(currentTopicRename){
        localStorage.setItem("searchTopic", modalTopic);
      }
      toast.dismiss();
      setTopicTitleHack(modalTopic);
      setRefetchQueries(true);
      toast.success("Search topic name updated", {icon: false});
      //onResumeCallback(modalTopic);
      setHighlightedTopic(modalTopic);
    }
  }, [editHack]);

  useEffect(()=>{
    setTopicTitleHack(queries[0].searchTopic);
    setCurrentTopicRename(queries[0].searchTopic === localStorage.getItem("searchTopic"));
  },[queries]);

  useEffect(()=>{
    setEditHack(false);
  },[topicTitleHack]);


  useEffect(()=>{
    if(localStorage.getItem('searchTopic')===topicTitleHack)
      {setResumeDisabled(true);}
    else{
      setResumeDisabled(false);
    }
  },[topicTitleHack]);
  
  const enhancedTimeline = useMemo(()=>(queries.map((query) => {
    const initialSearch = format(new Date(query.createdAt), "PP p");
    const latestSearch = format(new Date(query.updatedAt), "PP p");
    var previousDate = null;

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
      <div
        key={query._id}
        style={{
          backgroundColor: "white",
          padding: "20px 10px 30px 10px",
          margin: "20px 0px 0px 0px",
          border: "2px solid darkgrey",
          borderRadius: "10px",
          
        }}
      >
        <h4 style={{borderBottom: "1px solid #dedede", margin: "5px 0px 10px"}}>{format(new Date(query.createdAt), 'PP')}</h4>
        {query.documents.map((doc) => {
          // if (
          //   format(new Date(previousDate), "PP") ==
          //   format(new Date(doc.updatedAt), "PP")
          // ) {
            var timechanger = format(new Date(doc.createdAt), "p");
          // } else {
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
                <span style={{ textDecoration: "line-through" }}>
                  {doc.docdata.Title}{" "}
                </span>
              ) : (
                <span>
                <Records
                  key={doc.docdata.ControlNumber}
                  data={doc.docdata}
                  getDetails={getDetails}
                  savedDocsList={savedDocsList}
                  saveDoc={saveDoc}
                  showLoginRequiredMessage={showLoginRequiredMessage}
                  userobj={userobj}
                  setPageLoading={setPageLoading}
                  setShowDetails={setShowDetails}
                  setDetails={setDetails}
                  setShowLoginRequiredMessage={setShowLoginRequiredMessage}
                  setSavedDocsList={setSavedDocsList}
                  query={localStorage.getItem("searchTerm")}
                  searchTopic={doc.searchTopic}
                  setHack={setHack}
                  hack={hack}
                  setRefetchQueries={setRefetchQueries}
                  extraStyles={{marginTop: 0}}
                />
                </span>
              )}
              <div style={style.items_time}>{timechanger}</div>
            </div>
          );
        })}
        <div style={{ padding: "0px 0px" }}>
          <div
            style={style.query}
            onClick={() => {
              localStorage.setItem("searchTopic", topicTitleHack);
              getSearchResult(query.query)
            }}
          >
            <span style={{display:'flex',alignItems:'center', fontSize:"18px",fontWeight:"bold"}}>
                    <SearchIcon fontSize="small"> </SearchIcon>
                    {query.query} 
                    </span>
                    <span style={{float:'right'}}>{getDeviceIcon(query.os)}</span>

          </div>
          {/* {initialSearch !== latestSearch ?
          <>
           <div style={style.items_time}>Latest query at: {latestSearch}</div><br/>
            <div style={style.items_time}>Query initiated at: {initialSearch}</div>
           
          </>: */}
            <div style={style.items_time}>{initialSearch}</div>
          {/* } */}
        </div>
      </div>
    );
  })),[savedDocsList, queries, hack, topicTitleHack, setRefetchQueries]);


  const getSearchResult = async (searchTerm) => {
    localStorage.setItem("searchTerm", searchTerm);
    if (queries.length !== 0){
      const queryUser = queries[0].userId;
      try{
        await saveQueryOnSearch(searchTerm, queryUser, topicTitleHack);
      }catch(e){
        console.log(e);
      }
      
    }
    window.location = "/results";
  };

  return (
    <>
    <div style={{position: 'sticky', top: '0'}}>
      {queries.length == 0 ? (
        <h5>No queries found for this topic</h5>
      ) : (
        <div
          style={{
            backgroundColor: "lightblue",
            padding: "0px 15px 15px",
            margin: "0px 0px 0px 10px",
            border: "2px solid DarkGrey",
            borderRadius: "10px",
            height: "100vh",
            
          }}
        >
        
        <div  style={{display:'flex', justifyContent:'space-between'}}>

          <h3 style={{display:"flex",alignItems:"center"}}>Timeline for : {topicTitleHack}
          <EditIcon
                onClick={()=> {
                  setModalTopic(topicTitleHack)
                  setModalIsOpen(true);
                }}
              />
          </h3>

          <div style={{display:'flex',alignItems: 'center'}}>
              
              <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 1, mb: 0, color: "black" }}
                  onClick={()=> {
                    toast.dismiss();
                    localStorage.setItem("searchTopic", queries[0].searchTopic);
                    setResumeTopicHack(queries[0].searchTopic);
                    toast.success("Search topic resumed: "+queries[0].searchTopic, {icon: false});
                    onResumeCallback(queries[0].searchTopic);
                    setResumeDisabled(true);
                    setCurrentTopicRename(true);
                  }}
                  disabled={resumeDisabled}
                >
                {/* <RestartAltIcon/> */}
                <span>Resume</span>
                </Button>
            </div>

          </div>
          <Scrollbars style={{border: "2px solid lightblue",
            borderRadius: "10px",
            height:"92vh"}}>
            {enhancedTimeline}
          </Scrollbars>
          
        </div>
      )}
    </div>
    <ShowDetailsComponent
        details={details}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
      />

    <Loading open={pageLoading} />
    <ToastContainer
      theme="light"
      position="bottom-right"/>
    <Modal
        isOpen={modalIsOpen}
        onRequestClose={()=>setModalIsOpen(false)}
        contentLabel="Example Modal"
        style={customStyles}
        ariaHideApp={false}
      >
        
        <div>Edit topic name</div>
        <form>
          <input value={modalTopic} onChange={(event)=>setModalTopic(event.target.value)}/>
          <button onClick={()=> {
            editSearchTopic(topicTitleHack, modalTopic, userobj._id, setEditHack);
            setModalIsOpen(false);
            
            }}>save</button>
            
          <button onClick={()=>setModalIsOpen(false)}>close</button>
        </form>
      </Modal>
    </>
  );
}
