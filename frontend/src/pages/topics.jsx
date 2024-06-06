import { useEffect, useState, useMemo } from "react";
import { Grid, Button, setRef, Chip } from "@mui/material";
import { Container } from "@mui/system";
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import Header from "../components/header";
import Footer from "../components/footer";
import TheBreadCrumb from "../components/thebreadcrumb";
import Loading from "../components/loading";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { getQueriesByTopic } from "../components/functions";
import EnhancedTimeline from "../components/enhancedTimeline";
import { useCallback } from "react";
const style = {
  topic: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    padding: "5px 5px",
    border: "2px solid darkgrey",
    borderRadius: "8px",
    cursor: "pointer",
    // textDecoration: "underline",
    textDecorationColor: "black",    
  },

  highlightedTopic: {
    display: 'flex',
    // justifyContent: 'start',
    alignItems: 'center',
    padding: "5px 5px",
    border: "2px solid darkgrey",
    borderRadius: "8px",
    cursor: "pointer",
    // textDecoration: "underline",
    textDecorationColor: "white",
    backgroundColor: 'lightblue',
    color: 'black'
  },
}
const Topics = ({ userobj }) => {
  const [topicList, setTopicsList] = useState([]);
  const [queriesForTopic, setQueriesForTopic] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [refetchQueries, setRefetchQueries] = useState(false);
  const [highlightedTopic, setHighlightedTopic] = useState(localStorage.getItem('searchTopic'));
  const [ongoingTopic, setOngoingTopic] = useState(localStorage.getItem('searchTopic'));

  useEffect(() => {
    if (userobj._id !== "" && userobj._id != null) {
      getQueriesByTopic(userobj._id, setTopicsList, setPageLoading);
    }
   // setOngoingTopic(localStorage.getItem('searchTopic'));

  }, [refetchQueries]);

  const topicLinks = useMemo(() => {
    let links = [];
    for (const [key, value] of Object.entries(topicList)) {
      var obj = {};
      obj[key] = value;
      links.push(obj);
    }
    return links;
  }, [topicList]);

  useEffect(()=>{
    if (!pageLoading){
      setRefetchQueries(false);
    }
  },[pageLoading]);

  const handleResumeTopic = useCallback((topic) => {
    setOngoingTopic(topic);
  },[setOngoingTopic]);

  console.log(highlightedTopic);

  const timeline = useMemo(() => {
    if (queriesForTopic === null) {
      return <></>;
    }
    // else if (queriesForTopic[0].searchTopic === localStorage.getItem('searchTopic')){
    //   return <EnhancedTimeline queries={queriesForTopic} onResumeCallback={handleResumeTopic}
    // userobj={userobj} setRefetchQueries={setRefetchQueries} refetchQueries={refetchQueries}/>;
    // }
    else{
      return <EnhancedTimeline queries={queriesForTopic} onResumeCallback={handleResumeTopic}
              userobj={userobj} setRefetchQueries={setRefetchQueries} refetchQueries={refetchQueries} 
              setHighlightedTopic={setHighlightedTopic}/>;
    }
  }, [queriesForTopic, handleResumeTopic]);

  useEffect(()=>{
    topicLinks.map((link) => {
      const entries = Object.entries(link);
      const [key, value] = entries[0];
      if(highlightedTopic === key){
        setQueriesForTopic(value);
      }
      // else if(localStorage.getItem('searchTopic')===key) {
      //   setQueriesForTopic(value);
      // }
    })
  }, [topicLinks])

  return (
    <div className="pagelayout" sx={{ backgroundColor: "#f3f3f3" }}>
      {/* Header Component
                - For having consistency in your different pages layout, you have to add this component to each new page
                - In addition to userobj, you have to pass savedDocsListCounterNumber prop to update the number of saveddocslist because the saved documents may remove in this page */}
      <Header userobj={userobj} />

      {/* BreadCrumb Component
                - For having consistency in your different pages layout, you have to add this component to each new page and change the second part of the titles to the page title */}
      <TheBreadCrumb userobj={userobj} titles="Home,Workspaces" />

      <div style={{ backgroundColor: "#f3f3f3", padding: "20px 0px" }}>
        <Container>
          <Grid container style={{ position: "relative" }}>
            <Grid item xs={3}>
              <div>
                {topicLinks.map((link) => {
                  const entries = Object.entries(link);
                  const [key, value] = entries[0];
                  const latestQuery = value.length > 0 ? value[0]: undefined;
                  const latestQueryRepresentation = latestQuery ? format(new Date(latestQuery.updatedAt), "PP p"): '';
                  return(
                    <p key={key}>
                      <span style={highlightedTopic===key?style.highlightedTopic:style.topic} onClick={() => {setQueriesForTopic(value); setHighlightedTopic(key);}} >
                        <CollectionsBookmarkIcon sx={{ color: "#59b6c7" }}> </CollectionsBookmarkIcon>
                        <p style={{display:'flex',justifyContent:'space-between', alignItems:'center', flexGrow: 1, margin: "3px"}}>
                          <span>{key}</span>
                          <span style={{display:'flex',justifyContent:'space-between', alignItems:'center'}}>
              
                          {localStorage.getItem('searchTopic')===key &&
                            <Chip label='Ongoing Topic' size="small" variant="outlined" color='success'/>
                          }
                          
                          </span> 
                        </p>
                        
                      </span>
                      <span style={{display:'flex',justifyContent:'flex-end', alignItems:'center', color:"#59b6c7"}}>
                       <b>{latestQueryRepresentation}</b>
                      </span>
                    </p>
                  );
                })}
              </div>
            </Grid>

            <Grid item xs={9}>
              {timeline}
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* Footer Component
                - For having consistency in your different pages layout, you have to add this component to each new page */}
      <Footer userobj={userobj} />

      {/* This component show the details of a document as a Modal */}
      {/* Loading Component */}
      {/* Loading Component */}
      <Loading open={pageLoading} />
    </div>
  );
};

export default Topics;
