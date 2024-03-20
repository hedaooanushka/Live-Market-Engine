import { Form, Container } from 'react-bootstrap';
import Tabs from './Tabs';
import CompanyInfo from './CompanyInfo';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest'







export default function Search() {
    const [ticker_name, setTickerName] = useState("");
    const [summary_info, setSummaryInfo] = useState("default");
    const [summary_chart, setSummaryChart] = useState({ results: [] });
    const [news_info, setNewsInfo] = useState([]);
    const [charts_info, setChartsInfo] = useState({ results: [] });
    const [insights_info, setInsightsInfo] = useState({ results: [] });

    const [dataValid, setDataValid] = useState(false);
    const [click, setClick] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [suggestions, setSuggestions] = useState([]);
    const [isSuggestionSet, setIsSuggestionSet] = useState(false);
    const [autoSuggestLoader, setAutoSuggestLoader] = useState(true);

    const getSuggestionValue = suggestion => suggestion.displaySymbol;
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

    };
    useEffect(() => {
        if (isSuggestionSet) {
            // setIsValid(false);
            callBackend();
        }
    }, [isSuggestionSet]);



    var callBackend = () => {
        console.log("i clicked")
        setClick(true);
        setIsLoading(true);
        setDataValid(false);
        if (ticker_name !== "") {
            // console.log("go backkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
            console.log("ticker_name: " + ticker_name)
            axios.get(`http://localhost:3000/summary?ticker_name=${ticker_name}`)
                .then(response => {
                    setSummaryInfo(response.data);
                    // console.log("Summary Data: " + JSON.stringify(response.data));
                    // console.log("Peers: " + response.data.peers.length)
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
        // else console.log("isDataValid: " + isDataValid)

    }

    var handleInputChange = (event, { newValue }) => {
        const inputValue = typeof newValue === 'string' ? newValue : event.target.value;
        console.log("input value" + inputValue);
        setTickerName(inputValue);
        setClick(false);
        setIsSuggestionSet(false);
        setAutoSuggestLoader(true);
        if (inputValue.length > 0) {
            axios.get(`http://localhost:3000/autocomplete?query=${inputValue}`).then(response => {
                setAutoSuggestLoader(false);
                const filteredSuggestions = response.data.filter(suggestion =>
                    suggestion.type === 'Common Stock' && !suggestion.symbol.includes('.')
                );
                setSuggestions(filteredSuggestions);
            }).catch(error => {
                console.error('Failed to fetch suggestions:', error);
            });

        } else {
            setSuggestions([]);
        }

    }

    const handleSubmit = (event) => {
        event.preventDefault();
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
                    // console.log("############################")
                    // console.log(response.data);
                    setSummaryChart(response.data);
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
            axios.get(`http://localhost:3000/charts?ticker_name=${ticker_name}`)
                .then(response => {
                    // console.log("############################")
                    // console.log(JSON.stringify(response.data));
                    setChartsInfo(response.data);
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
            axios.get(`http://localhost:3000/insights?ticker_name=${ticker_name}`)
                .then(response => {
                    console.log("############################")
                    console.log(JSON.stringify(response.data));
                    setInsightsInfo(response.data);
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
        }
    }, [dataValid]);

    return (
        <>
            <br />
            <p style={{ textAlign: 'center', fontSize: '32px', fontFamily: 'sans-serif' }}>STOCK SEARCH</p>
            <br />
            <Container className="d-flex" style={{ borderRadius: '25px', border: 'blue solid 1px', padding: '6px', width: '33%', position: 'relative' }}>
                <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
                    <Form.Group>
                        {/* <Form.Control onChange={handleInputChange} id="ticker_name" style={{ border: 'none' }} type="text" placeholder="Enter stock ticker symbol" /> */}
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
                                    listStyleType: 'none', // This line should remove the dot
                                    paddingLeft: '0'
                                    // fontWeight: '600',
                                }
                            }}
                            renderSuggestionsContainer={({ containerProps, children, query }) => {
                                return (suggestions.length > 0 || (autoSuggestLoader && ticker_name.length > 0)) && (
                                    <div {...containerProps} style={{...containerProps.style, maxHeight: '200px', overflow: 'auto'}}>
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
                            onSuggestionsFetchRequested={({ value }) => { }}
                            onSuggestionsClearRequested={() => setSuggestions([])}
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
                <svg type="button" style={{ marginTop: '8px' }} className="mx-3 bi bi-x-lg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
                {/* <br/><br/><br/><br/><br/><br/><br/>
                <p></p> */}
            </Container>
            <br />
            <CompanyInfo info={summary_info} ticker_name={ticker_name} dataValid={dataValid} click={click} isLoading={isLoading} />
            {/* <p>{company_info.peers}</p> */}
            <br />
            <Tabs info={summary_info} summary_chart={summary_chart} news={news_info} charts={charts_info} insights={insights_info} ticker_name={ticker_name} isValid={dataValid} />
            {/* <Summary news={news_info}/> */}

        </>
    )
}

