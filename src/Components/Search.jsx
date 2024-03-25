import { Form, Container } from 'react-bootstrap';
import Tabs from './Tabs';
import CompanyInfo from './CompanyInfo';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest'
import { useNavigate, useParams, useLocation } from 'react-router-dom';






export default function Search(props) {
    // console.log(props.ticker_name)
    // let url = useLocation().pathname;
    // let ishome = url.endsWith("/home");
    // const [endsWithHome, setEndsWithHome] = useState(true);
    // setEndsWithHome(ishome)

    // console.log("url = " + location);
    // console.log("endsWithHome = " + endsWithHome);


    let cancelTokenSource = axios.CancelToken.source();
    const [ticker_name, setTickerName] = useState("");
    const [summary_info, setSummaryInfo] = useState("default");
    const [summary_chart, setSummaryChart] = useState({ results: [] });
    const [news_info, setNewsInfo] = useState([]);
    const [charts_info, setChartsInfo] = useState({ results: [] });
    const [insights_info, setInsightsInfo] = useState({ results: [] });
    const [url, setUrl] = useState("");
    const [dataValid, setDataValid] = useState(false);
    const [click, setClick] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let timeoutId = null;
    const [suggestions, setSuggestions] = useState([]);
    const [isSuggestionSet, setIsSuggestionSet] = useState(false);
    const [autoSuggestLoader, setAutoSuggestLoader] = useState(true);
    const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);
    const [hide, setHide] = useState(false);
    const getSuggestionValue = suggestion => suggestion.displaySymbol;
    const navigate = useNavigate();

    useEffect(() => {
        if (props?.ticker_name) {
            setTickerName(props?.ticker_name);

            console.log("new ticker" + ticker_name)
            callBackend();
        }
    })



    const renderSuggestion = (suggestion, { query, isHighlighted }) => (
        <div style={{
            backgroundColor: isHighlighted ? '#fafafa' : 'white',
            cursor: 'pointer',
            margin: '20px 0', // Add this line to add some space between items
        }}>
            <span>{suggestion.displaySymbol} | {suggestion.description}</span>
        </div>
    );
    const onSuggestionSelected = (event, { suggestion }) => {
        event.preventDefault();
        setIsSuggestionSet(true);
        console.log("Selected: " + suggestion.displaySymbol)
        setTickerName(suggestion.displaySymbol);
        setIsSuggestionSelected(true);

    };
    useEffect(() => {
        if (isSuggestionSet) {
            // setIsValid(false);
            callBackend();
        }
    }, [isSuggestionSet]);



    var callBackend = (storedTickerName) => {
        setHide(false);
        if (props?.ticker_name) setTickerName(props?.ticker_name)
        if (storedTickerName) {
            navigate(`/search/${storedTickerName}`);
            console.log("ticker name in callbackend = " + storedTickerName)
            console.log("i clicked")
            setClick(true);
            setIsLoading(true);
            setDataValid(false);
            if (storedTickerName !== "") {
                console.log("ticker_name: " + storedTickerName)
                axios.get(`http://localhost:3000/summary?ticker_name=${storedTickerName}`)
                    .then(response => {
                        setSummaryInfo(response.data);
                        setIsLoading(false);
                        if (response.data.peers.length > 0) {
                            setDataValid(true);
                        }
                        else {
                            setDataValid(false);
                        }
                    })
                    .catch(error => {
                        console.error('An error occurred:', error);
                    });
            }
        }
        else {
            navigate(`/search/${ticker_name}`);
            setClick(true);
            setIsLoading(true);
            setDataValid(false);
            if (ticker_name !== "") {
                console.log("ticker_name: " + ticker_name)
                axios.get(`http://localhost:3000/summary?ticker_name=${ticker_name}`)
                    .then(response => {
                        setSummaryInfo(response.data);
                        setIsLoading(false);
                        if (response.data.peers.length > 0) {
                            setDataValid(true);
                        }
                        else {
                            setDataValid(false);
                        }
                    })
                    .catch(error => {
                        console.error('An error occurred:', error);
                    });
            }
        }
    }

    var handleInputChange = (event, { newValue }) => {
        const inputValue = typeof newValue === 'string' ? newValue : event.target.value;
        setTickerName(inputValue);
        setClick(false);
        setIsSuggestionSet(false);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate(`/search/${ticker_name}`);
        callBackend();
    };

    useEffect(() => {
        if (dataValid) {
            axios.get(`http://localhost:3000/news?ticker_name=${ticker_name}`)
                .then(response => {
                    setNewsInfo(response.data);
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
            axios.get(`http://localhost:3000/summary-charts?ticker_name=${ticker_name}`)
                .then(response => {
                    setSummaryChart(response.data);
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
            axios.get(`http://localhost:3000/charts?ticker_name=${ticker_name}`)
                .then(response => {
                    setChartsInfo(response.data);
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
            axios.get(`http://localhost:3000/insights?ticker_name=${ticker_name}`)
                .then(response => {
                    setInsightsInfo(response.data);
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
        }
    }, [dataValid]);


    useEffect(() => {
        const path = window.location.pathname;
        setUrl(path);
        console.log(path)
        let ishome = path.endsWith("/home");
        console.log(ishome)
        if (!ishome) {
            let storedTickerName = path.split("/search/")[1];
            console.log("storedTickerName", storedTickerName)
            setTickerName(storedTickerName);
            callBackend(storedTickerName);
        }
    }, [window.location.pathname])

    function clearAll() {
        setTickerName("");
        navigate("/search/home");
        setHide(true);
    }
    // useEffect(() => {
    //     // Set up a timer to refresh the page every 15 seconds
    //     const timer = setInterval(() => {
    //         setHide(false);
    //         if (ticker_name !== "") {
    //             // navigate(`/search/${ticker_name}`);
    //             console.log("ticker name in callbackend = " + ticker_name)
    //             console.log("i clicked")

    //             if (ticker_name !== "") {
    //                 console.log("ticker_name: " + ticker_name)
    //                 axios.get(`http://localhost:3000/summary?ticker_name=${ticker_name}`)
    //                     .then(response => {
    //                         setSummaryInfo(response.data);
    //                     })
    //                     .catch(error => {
    //                         console.error('An error occurred:', error);
    //                     });
    //             }

    //         }
    //     }, 15000);

    //     // Clean up the timer when the component is unmounted
    //     return () => clearInterval(timer);
    // }, [ticker_name]); // Include ticker_name in the dependency array
    return (
        <>
            <br />
            <p style={{ textAlign: 'center', fontSize: '32px', fontFamily: 'sans-serif' }}>STOCK SEARCH</p>
            <br />
            <Container className="d-flex" style={{ borderRadius: '25px', border: 'blue solid 1px', padding: '6px', width: '33%', position: 'relative' }}>
                <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
                    <Form.Group>
                        <Autosuggest
                            theme={{
                                suggestionsContainer: {
                                    position: 'absolute',
                                    width: '100%',
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',
                                    borderRadius: '4px',
                                    backgroundColor: 'white',
                                    padding: '10px',
                                },
                                suggestionsList: {
                                    listStyleType: 'none',
                                    paddingLeft: '0'
                                }
                            }}
                            renderSuggestionsContainer={({ containerProps, children, query }) => {
                                return (!click && (suggestions.length > 0 || (autoSuggestLoader && ticker_name.length > 0))) && (
                                    <div {...containerProps} style={{ ...containerProps.style, maxHeight: '200px', overflow: 'auto' }}>
                                        {autoSuggestLoader && ticker_name.length > 0 && suggestions.length == 0 ?
                                            <div className="d-flex justify-content-center">
                                                <div className="spinner-border" role="status">
                                                </div>
                                            </div>
                                            : children}
                                    </div>
                                );
                            }}

                            suggestions={suggestions}
                            // when you want to fetch something
                            // Declare a variable to hold the timeout ID
                            onSuggestionsFetchRequested={({ value }) => {
                                if (!isSuggestionSelected) {
                                    // Cancel the previous delay


                                    if (value.length > 0) {
                                        // Set a delay before fetching the suggestions
                                        // timeoutId = setTimeout(() => {
                                        setAutoSuggestLoader(true);
                                        setSuggestions([]);
                                        // Cancel the previous request
                                        cancelTokenSource.cancel();

                                        // Create a new CancelToken source
                                        cancelTokenSource = axios.CancelToken.source();

                                        axios.get(`http://localhost:3000/autocomplete?query=${value}`, {
                                            cancelToken: cancelTokenSource.token
                                        }).then(response => {
                                            const filteredSuggestions = response.data.filter(suggestion =>
                                                suggestion.type === 'Common Stock' && !suggestion.symbol.includes('.')
                                            );
                                            setSuggestions(filteredSuggestions);
                                            setAutoSuggestLoader(false);
                                        }).catch(error => {
                                            if (axios.isCancel(error)) {
                                                console.log('Request canceled:', error.message);
                                            } else {
                                                console.error('Failed to fetch suggestions:', error);
                                                setAutoSuggestLoader(false);
                                            }
                                        });
                                        // }, 100); // 300ms delay
                                    } else {
                                        setSuggestions([]);
                                        setAutoSuggestLoader(false);
                                    }
                                } else {
                                    setSuggestions([]);
                                }
                            }}
                            onSuggestionsClearRequested={() => {
                                setSuggestions([]);
                                setIsSuggestionSelected(false);
                            }}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            onSuggestionSelected={onSuggestionSelected}
                            // when nothing is entered in ticker name, give suggestions only when something is entered
                            shouldRenderSuggestions={(value) => value !== undefined && value.trim().length > 0}
                            inputProps={{
                                placeholder: "Enter stock ticker symbol",
                                value: ticker_name,
                                onChange: handleInputChange,
                                style: { ouline: 'none', border: '0px', width: '100%' }
                            }}
                        />
                    </Form.Group>
                </Form>
                <svg type="button" onClick={callBackend} style={{ marginTop: '8px' }} className="ms-auto bi bi-search" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
                <svg type="button" onClick={clearAll} style={{ marginTop: '8px' }} className="mx-3 bi bi-x-lg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
            </Container>
            <br />
            <CompanyInfo hide={hide} info={summary_info} ticker_name={ticker_name} dataValid={dataValid} click={click} isLoading={isLoading} />
            <br />
            <Tabs hide={hide} info={summary_info} summary_chart={summary_chart} news={news_info} charts={charts_info} insights={insights_info} ticker_name={ticker_name} isValid={dataValid} />

        </>
    )
}