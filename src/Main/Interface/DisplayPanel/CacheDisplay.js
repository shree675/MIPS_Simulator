import React, {useState} from "react";

const CacheDisplay = (props) => {

    var l1sets=props.l1sets;
    var l2sets=props.l2sets;

    // console.log(l2sets);

    var valid=props.valid;
    
    // console.log(l1sets);

    var colors=["tomato","blue"];
    var ind=0;

    return (

        (valid===0?(

        <table id="cache-display-table" className="cache-settings-table">

              <tr id="cache-display-row" className="table-row">

                <td id="cache-display-data" className="table-row">
                  
                  <div style={{fontWeight: `bold`, textAlign: `center`, fontSize: `20px`}}>L1</div>

                  <table className="cache-settings-table">

                  {l1sets.map((e)=>(
                    e.map((eh)=>(<tr className="table-row">
                      {eh.map((ehx)=>(<td style={{color: `white`, width: `50%`, textAlign: `center`, borderColor: colors[(l1sets.indexOf(e))%2] }} className="table-row">{ehx}</td>))}
                    </tr>))
                  ))}

                  </table>

                </td>

                <td id="cache-display-data" className="table-row">
                  
                  <div style={{fontWeight: `bold`, textAlign: `center`, fontSize: `20px`}}>L2</div>

                  <table className="cache-settings-table">

                  {l2sets.map((e)=>(
                    e.map((eh)=>(<tr className="table-row">
                      {eh.map((ehx)=>(<td style={{width: `50%`, textAlign: `center`, borderColor: colors[(l2sets.indexOf(e))%2]}} className="table-row">{ehx}</td>))}
                    </tr>))
                  ))}

                  </table>

                </td>

              </tr>

            </table>

        ):(<table></table>))

    );

}

export default CacheDisplay;