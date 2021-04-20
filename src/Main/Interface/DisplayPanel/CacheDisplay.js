import React from "react";

const CacheDisplay = (props) => {

    var l1sets=props.l1sets;            // L1 cache table
    var l2sets=props.l2sets;            // L2 cache table
    var l1assocerror=props.l1assocerror;

    var valid;

    if(l1sets.length===0){              // if editor is empty
      valid=0;
    }
    else{
      valid=1;
    }
    
    /* alternate blue and green colors for distinguishing sets */
    var colors=["#8be9fd","#39ed7b"];
    var bgcolors=["rgba(139,233,253,0.2)","rgba(57,237,123,0.2)"];

    return (

        (valid===1?(                          // if editor contains code, display cache tables

          <div>
            {(l1assocerror===true?(           // display error message in case of error
              <div className="no-padding">
              <div className="l1assoc-error"><span style={{color: `#ee2222`}}>Error(X): </span>L1 associativity cannot be 4 for the chosen configuration</div>
              <div className="l1assoc-error"><span style={{color: `lightblue`, opacity: `0.8`}}>Override: </span>L1 associativity changed to <em>'Fully Associative'</em></div>
              </div>
            ):(<span></span>))}
            
        <table id="cache-display-table" className="cache-settings-table">

              <tr id="cache-display-row" className="table-row">

                <td id="cache-display-data" className="table-row">
                  
                  <div style={{fontWeight: `bold`, textAlign: `center`, fontSize: `20px`}}>L1</div>

                  <table className="cache-settings-table">

                  {l1sets.map((e)=>(                        // converting L1 3D array into a 2D table with alternating colors
                    e.map((eh)=>(<tr className="table-row">
                      {eh.map((ehx)=>(<td style={{color: `white`, width: `50%`, textAlign: `center`, borderColor: colors[(l1sets.indexOf(e))%2], backgroundColor: bgcolors[(l1sets.indexOf(e))%2] }} className="table-row">{ehx}</td>))}
                    </tr>))
                  ))}

                  </table>

                </td>

                <td id="cache-display-data" className="table-row">
                  
                  <div style={{fontWeight: `bold`, textAlign: `center`, fontSize: `20px`}}>L2</div>

                  <table className="cache-settings-table">

                  {l2sets.map((e)=>(                        // converting L2 3D array into a 2D table with alternating colors
                    e.map((eh)=>(<tr className="table-row">
                      {eh.map((ehx)=>(<td style={{width: `50%`, textAlign: `center`, borderColor: colors[(l2sets.indexOf(e))%2], backgroundColor: bgcolors[(l2sets.indexOf(e))%2] }} className="table-row">{ehx}</td>))}
                    </tr>))
                  ))}

                  </table>

                </td>

              </tr>

            </table>

            <div className="cache-info">Note: <em>Contiguous blocks with same color represent one set</em></div>
            <br></br>
          
          </div>

        ):(                                       // if editor is empty
        <div>                                     

            {(l1assocerror===true?(               // display error message in case of error
              <div className="no-padding">
              <div className="l1assoc-error"><span style={{color: `tomato`}}>Error(X): </span>L1 associativity cannot be 4 for the chosen configuration</div>
              <div className="l1assoc-error"><span style={{color: `lightblue`, opacity: `0.8`}}>Override: </span>L1 associativity changed to <em>'Fully Associative'</em></div>
              </div>
            ):(<span></span>))}

        <br></br>
        <div className="caution-symbol">⚠</div>
        <div className="cache-caution"><em>Write some code and click 'STEP' or 'RUN' to generate cache tables</em></div>
        </div>
        ))

    );

}

export default CacheDisplay;