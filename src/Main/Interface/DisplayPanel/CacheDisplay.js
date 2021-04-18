import React from "react";

const CacheDisplay = (props) => {

    var l1sets=props.l1sets;
    var l2sets=props.l2sets;

    var valid;

    //console.log(l1sets);

    if(l1sets.length===0){
      valid=0;
    }
    else{
      valid=1;
    }
    
    /* var colors=["#dec24a","#39ed7b"]; */
    var colors=["#8be9fd","#39ed7b"];
    /* var bgcolors=["rgba(255,255,0,0.1)","rgba(144,238,144,0.1)"]; */
    var bgcolors=["rgba(139,233,253,0.2)","rgba(57,237,123,0.2)"];

    return (

        (valid===1?(

          <div>

        <table id="cache-display-table" className="cache-settings-table">

              <tr id="cache-display-row" className="table-row">

                <td id="cache-display-data" className="table-row">
                  
                  <div style={{fontWeight: `bold`, textAlign: `center`, fontSize: `20px`}}>L1</div>

                  <table className="cache-settings-table">

                  {l1sets.map((e)=>(
                    e.map((eh)=>(<tr className="table-row">
                      {eh.map((ehx)=>(<td style={{color: `white`, width: `50%`, textAlign: `center`, borderColor: colors[(l1sets.indexOf(e))%2], backgroundColor: bgcolors[(l1sets.indexOf(e))%2] }} className="table-row">{ehx}</td>))}
                    </tr>))
                  ))}

                  </table>

                </td>

                <td id="cache-display-data" className="table-row">
                  
                  <div style={{fontWeight: `bold`, textAlign: `center`, fontSize: `20px`}}>L2</div>

                  <table className="cache-settings-table">

                  {l2sets.map((e)=>(
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

        ):(<div><br></br>
        <div className="caution-symbol">⚠</div>
        <div className="cache-caution"><em>Write some code and click 'STEP' or 'RUN' to generate cache tables</em></div>
        </div>))

    );

}

export default CacheDisplay;