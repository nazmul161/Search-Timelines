import { useEffect, useState } from "react";
import { Divider, Grid } from "@mui/material";
import { Container } from "@mui/system";

import Header from "../components/header";
import Footer from "../components/footer";
import Loading from "../components/loading";
import TheBreadCrumb from "../components/thebreadcrumb";
import Records from "../components/records";
import ShowDetailsComponent from "../components/showdetailscomponent";

import {
  getDetails,
  getSavedDocs,
  removeDoc,
  getQueryList,
} from "../components/functions";
import UserTimeline from "../components/timeline";

const SavedDocsList = ({ userobj }) => {
  const [pageLoading, setPageLoading] = useState(false);
  const [savedDocsList, setSavedDocsList] = useState([]);
  const [savedDocsItems, setSavedDocsItems] = useState([]);
  const [showLoginRequiredMessage, setShowLoginRequiredMessage] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState(Array());
  const [queries, setQueries] = useState([]);

  // When a user type a search query, it will save in the local storage
  var searchTerm = localStorage.getItem("searchTerm");
  const searchTopic =localStorage.getItem("searchTopic");

  useEffect(() => {
    if (userobj._id != "" && userobj._id != null) {
      getSavedDocs(
        userobj._id,
        setPageLoading,
        setSavedDocsItems,
        setSavedDocsList
      );
      getQueryList(userobj._id, setQueries, searchTopic);
    }
  }, []);

  return (
    <div className="pagelayout" sx={{ backgroundColor: "#f3f3f3" }}>
      {/* Header Component
                - For having consistency in your different pages layout, you have to add this component to each new page
                - In addition to userobj, you have to pass savedDocsListCounterNumber prop to update the number of saveddocslist because the saved documents may remove in this page */}
      <Header
        userobj={userobj}
        savedDocsListCounterNumber={savedDocsList.length}
      />

      {/* BreadCrumb Component
                - For having consistency in your different pages layout, you have to add this component to each new page and change the second part of the titles to the page title */}
      <TheBreadCrumb userobj={userobj} titles="Home,Saved Documents List" />

      <div style={{ backgroundColor: "#f3f3f3", padding: "20px 0px" }}>
        <Container>
          <Grid container style={{ position: "relative" }}>
            <Grid item xs={9}>
              <span style={{ fontSize: 18 }}>
                <b>Saved Documents List:</b>
              </span>
              <Divider />

              {/* Iterating through the saved documents */}
              {savedDocsItems.map((data) => {
                data = data.docdata;
                return (
                  <Records
                    key={data.ControlNumber}
                    data={data}
                    getDetails={getDetails}
                    savedDocsList={savedDocsList}
                    removeDoc={removeDoc}
                    showLoginRequiredMessage={showLoginRequiredMessage}
                    userobj={userobj}
                    setPageLoading={setPageLoading}
                    setShowDetails={setShowDetails}
                    setDetails={setDetails}
                    setShowLoginRequiredMessage={setShowLoginRequiredMessage}
                    setSavedDocsList={setSavedDocsList}
                    setSavedDocsItems={setSavedDocsItems}
                    savedDocsItems={savedDocsItems}
                    query={searchTerm}
                    queries={queries}
                    setQueries={setQueries}
                  />
                );
              })}
            </Grid>
            <Grid item xs={3}>
              <UserTimeline queries={queries} />
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* Footer Component
                - For having consistency in your different pages layout, you have to add this component to each new page */}
      <Footer userobj={userobj} />

      {/* This component show the details of a document as a Modal */}
      <ShowDetailsComponent
        details={details}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
      />

      {/* Loading Component */}
      <Loading open={pageLoading} />
    </div>
  );
};

export default SavedDocsList;
