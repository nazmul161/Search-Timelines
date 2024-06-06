import { useEffect, useState, useMemo } from "react";
import { Grid, Divider, Pagination } from "@mui/material";
import { Container } from "@mui/system";
import UserTimeline from "../components/timeline";
import Header from "../components/header";
import Footer from "../components/footer";
import Loading from "../components/loading";
import TheBreadCrumb from "../components/thebreadcrumb";
import Records from "../components/records";
import ShowDetailsComponent from "../components/showdetailscomponent";

import {
  getSavedDocsControlNumbers,
  getSearchResult,
  getDetails,
  saveDoc,
  getQueryList,
  saveQueryOnSearch,
} from "../components/functions";

const Results = ({ userobj }) => {
  const [searchResults, setSearchResults] = useState(Array());
  const [resultsPage, setResultsPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);
  const [totalRecordsFound, setTotalRecordsFound] = useState(0);
  const [details, setDetails] = useState(Array());
  const [showDetails, setShowDetails] = useState(false);
  const [savedDocsList, setSavedDocsList] = useState([]);
  const [showLoginRequiredMessage, setShowLoginRequiredMessage] = useState(0);
  const [hack, setHack] = useState(false);
  const [queries, setQueries] = useState(null);
  const searchTopic = localStorage.getItem("searchTopic");
  // When a user type a search query, it will save in the local storage
  var searchTerm = localStorage.getItem("searchTerm");
  useEffect(() => {
    getSearchResult(
      1,
      searchTerm,
      setSearchResults,
      setTotalRecordsFound,
      setResultsPage,
      setPageLoading
    );
    if (userobj._id != "" && userobj._id != null) {
      getSavedDocsControlNumbers(userobj._id, setSavedDocsList, searchTerm, searchTopic);
    }
  }, []);

  useEffect(() => {
    if (userobj._id != "" && userobj._id != null) {
      //saveQueryOnSearch(searchTerm, userobj._id, searchTopic);
      getQueryList(userobj._id, setQueries, searchTopic);
    }
  }, [hack]);

  const timeline = useMemo(() => {
    if (queries === null) {
      return <></>;
    }
    return <UserTimeline queries={queries} searchTopic={searchTopic} setPageLoading={setPageLoading} setDetails={setDetails} setShowDetails={setShowDetails} />;
  }, [queries]);

  return (
    <div className="pagelayout" sx={{ backgroundColor: "#f3f3f3" }}>
      {/* Header Component
                - For having consistency in your different pages layout, you have to add this component to each new page
                - In addition to userobj, you have to pass savedDocsListCounterNumber prop to update the number of saveddocslist because the saved documents may add/remove in this page */}
      <Header
        userobj={userobj}
        savedDocsListCounterNumber={savedDocsList.length}
      />

      {/* BreadCrumb Component
                - For having consistency in your different pages layout, you have to add this component to each new page and change the second part of the titles to the page title */}
      <TheBreadCrumb userobj={userobj} titles="Home,Search Results" />

      {/* // Page content */}
      <div style={{ backgroundColor: "#f3f3f3", padding: "20px 0px" }}>
        <Container>
          <Grid container style={{ position: "relative" }}>
            <Grid item xs={8}>
              <span style={{ fontSize: 18 }}>
                <b>Results for:</b> {searchTerm}
              </span>
              <div
                style={{ position: "relative", float: "right", fontSize: 18 }}
              >
                <b>Search Results: {totalRecordsFound} (page {resultsPage-1} of {Math.ceil(totalRecordsFound/20)})</b>
              </div>
              <Divider />

              {/* Iterating through the search results */}
              {searchResults.map((data) => (
                <Records
                  key={data.ControlNumber}
                  data={data}
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
                  query={searchTerm}
                  searchTopic={searchTopic}
                  setHack={setHack}
                  hack={hack}
                />
              ))}

              {/* Pagination which uses for considering different pages for the results */}
              <Pagination
                count={Math.ceil(totalRecordsFound / 20)}
                page={resultsPage - 1}
                variant="outlined"
                shape="rounded"
                onChange={(e, v) => {
                  getSearchResult(
                    v,
                    searchTerm,
                    setSearchResults,
                    setTotalRecordsFound,
                    setResultsPage,
                    setPageLoading
                  );
                  window.scrollTo(0, 0);
                }}
                style={{ justifyContent: "center", display: "flex" }}
              />
            </Grid>

            <Grid item xs={4}>
              {timeline}
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

export default Results;
