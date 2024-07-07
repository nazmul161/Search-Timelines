import axios from "axios";
import qs from "qs";
import { toast } from 'react-toastify';
import React from 'react';
import DeviceInfo from 'react-native-device-info';

//  let backendurl='http://localhost:5000';
let backendurl='https://backend-7uej64gd5a-uc.a.run.app';

 let corsurl='';
//let corsurl='https://cors-anywhere-7uej64gd5a-uc.a.run.app/';

// This function gets the controlnumbers of the saved documents and puts it in the savedDocsList state hook.
const getSavedDocsControlNumbers = (uid, setSavedDocsList, query, searchTopic) => {
  axios({
    method: "post",
    url: backendurl+"/saveddocs/controlnumberslist",
    data: qs.stringify({
      userId: uid,
      query: query,
      searchTopic: searchTopic,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  })
    .then(function (response) {
      setSavedDocsList(response.data.list);
    })
    .catch(function (error) {
      console.log(error);
    });
};

// This function gets the search results and puts it in the searchResults state hook
// searchTerm variable should be defined before this function.
const getSearchResult = (
  page,
  searchTerm,
  setSearchResults,
  setTotalRecordsFound,
  setResultsPage,
  setPageLoading
) => {
  setPageLoading(true);
  axios
    .get(
      corsurl+"http://147.182.148.79/sils/api/search?page=" +
        page +
        "&terms=" +
        searchTerm + "&sort=RELEVANCE"
    )
    .then(function (response) {
      // setSearchResults([...searchResults, ...response.data.content.BibSearchRows]);
      setSearchResults(response.data.content.BibSearchRows);
      setTotalRecordsFound(response.data.content.TotalRecordsFound);
      // console.log(response);
      setResultsPage(page + 1);
      setPageLoading(false);
    })
    .catch(function (error) {
      console.log(error);
      setPageLoading(false);
    });
};

// This function gets the details of a specific document and puts it in the details state hook
const getDetails = (bibId, setPageLoading, setShowDetails, setDetails) => {
  setPageLoading(true);

  axios
    .get(corsurl+"http://147.182.148.79/sils/api/search/item/full/" + bibId)
    .then(function (response) {
      setShowDetails(true);
      setPageLoading(false);
      // setDetails(response.data.content.search);
      setDetails(response.data.content.details);
    })
    .catch(function (error) {
      console.log(error);
    });
};

// This function is for saving/removing a document to/from saved documents list
const saveDoc = (
  query,
  uid,
  docdata,
  setShowLoginRequiredMessage,
  setPageLoading,
  savedDocsList,
  setSavedDocsList,
  searchTopic,
  setHack,
  hack,
) => {
  if (uid == null || uid == "") {
    setShowLoginRequiredMessage(docdata.ControlNumber);
  } else {
    setPageLoading(true);
    console.log(searchTopic);
    axios({
      method: "post",
      url: backendurl+"/saveddocs/save",
      data: qs.stringify({
        userId: uid,
        ControlNumber: docdata.ControlNumber,
        docdata: JSON.stringify(docdata),
        query: query,
        parentId: "62b4a514085c36e25f15f9b2",
        searchTopic:searchTopic,
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
      .then(function (response) {
        setPageLoading(false);
        setHack(!hack);
        if (savedDocsList.indexOf(response.data.ControlNumber) == -1) {
          setSavedDocsList([...savedDocsList, response.data.ControlNumber]);
        } else {
          setSavedDocsList(
            savedDocsList.filter((item) => item !== response.data.ControlNumber)
          );
        }
      })
      .catch(function (error) {
        setPageLoading(false);
        console.log(error);
      });
  }
};

// This function gets the list of the saved documents and puts it in the savedDocsItems state hook.
const getSavedDocs = (
  uid,
  setPageLoading,
  setSavedDocsItems,
  setSavedDocsList
) => {
  setPageLoading(true);

  axios({
    method: "post",
    url: backendurl+"/saveddocs/list",
    data: qs.stringify({
      userId: uid,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  })
    .then(function (response) {
      setPageLoading(false);
      setSavedDocsItems(response.data);
      // console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  axios({
    method: "post",
    url: backendurl+"/saveddocs/controlnumberslist",
    data: qs.stringify({
      userId: uid,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  })
    .then(function (response) {
      setPageLoading(false);
      setSavedDocsList(response.data.list);
      // console.log(response.data.list);
    })
    .catch(function (error) {
      console.log(error);
    });
};

// This function is for removing a document from saved documents list
const removeDoc = (
  query,
  uid,
  docdata,
  setShowLoginRequiredMessage,
  setPageLoading,
  savedDocsList,
  setSavedDocsList,
  searchTopic,
  setHack,
  hack,
  setSavedDocsItems,
  savedDocsItems,
  queries,
) => {
  console.log(queries[1].documents[9].createdAt);

  if (uid == null || uid == "") {
    setShowLoginRequiredMessage(docdata.ControlNumber);
  } else {
    setPageLoading(true);
    axios({
      method: "post",
      url: backendurl+"/saveddocs/save",
      data: qs.stringify({
        userId: uid,
        ControlNumber: docdata.ControlNumber,
        docdata: JSON.stringify(docdata),
        query: query,
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
      .then(function (response) {
        setPageLoading(false);
        setHack(!hack);
        if (savedDocsList.indexOf(response.data.ControlNumber) == -1) {
          // do nothing
        } else {
          setSavedDocsList(
            savedDocsList.filter((item) => item !== response.data.ControlNumber)
          );
          setSavedDocsItems(
            savedDocsItems.filter(
              (item) => item.ControlNumber !== response.data.ControlNumber
            )
          );
        }
      })
      .catch(function (error) {
        setPageLoading(false);
        console.log(error.response.data.error);
      });
  }
};

// This function gets the controlnumbers of the saved documents and puts it in the savedDocsList state hook.
const getQueryList = (uid, setQueries, searchTopic) => {
  axios({
    method: "post",
    url: backendurl+"/saveddocs/querylist",
    data: qs.stringify({
      userId: uid,
      searchTopic: searchTopic,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  })
    .then(function (response) {
      setQueries(response.data.list);
    })
    .catch(function (error) {
      console.log(error);
    });
};

// This function gets the controlnumbers of the saved documents and puts it in the savedDocsList state hook.
const getQueriesByTopic = (uid, setTopicsList, setPageLoading) => {
  setPageLoading(true);
  axios({
    method: "post",
    url: backendurl+"/saveddocs/queriesByTopic",
    data: qs.stringify({
      userId: uid,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  })
    .then(function (response) {
      setTopicsList(response.data);
      setPageLoading(false);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const saveQueryOnSearch = async (query, userId, searchTopic) => {
  console.log(query);
  const os = await DeviceInfo.getBaseOs();
  return axios({
      method: "post",
      url: backendurl+"/saveddocs/saveQueryOnSearch",
      data: qs.stringify({
        userId: userId,
        query: query,
        searchTopic: searchTopic,
        os: os
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
  

}

const editSearchTopic = (oldTopic, newTopic, userId, setEditHack) => {
 if(newTopic === "") return;
 axios({
  method: "post",
  url: backendurl+"/saveddocs/editTopicName",
  data: qs.stringify({
    userId: userId,
    newTopic: newTopic,
    searchTopic: oldTopic,
  }),
  headers: {
    "content-type": "application/x-www-form-urlencoded;charset=utf-8",
  },
})
  .then(function (response) {
    setEditHack(true);
    console.log("success");
  })
  .catch(function (error) {
    console.log(error);
  });

}

export {
  getSavedDocsControlNumbers,
  getSearchResult,
  getDetails,
  saveDoc,
  getSavedDocs,
  removeDoc,
  getQueryList,
  getQueriesByTopic,
  saveQueryOnSearch,
  editSearchTopic
};
