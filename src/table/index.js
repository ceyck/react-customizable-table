const React = require('react');
const { endResizeTable, initResizeTable, resizeTable } = require('./utils/resizetable');
let _this;
class Table extends React.Component {
   constructor(props){
      super(props);
      this.state = {
         table: React.createRef(),
         divider: {display:'block',position:'absolute',right:'0px',top:'0',cursor:'col-resize',height:'100%'},
      }
      _this = this;
   }
   /**
   *   -----------------------------------------------------------------
   *   # OPTION FOR RESIZE COLUMNS TABLE
   *   -----------------------------------------------------------------
   *   ------> @params resizerColor | String -> Change resizer color
   *   ------> @params resizerWidth | String -> Change resizer width
   *
   *   ------> @return JSX Element  | HTML Tag
   */
   static Resizer = ({resizerColor, resizerWidth}) => {
      let color = resizerColor ? resizerColor : '#f7f7f7';
      let width = resizerWidth ? resizerWidth + 'px' : '2px'
      return (
         <i 
            style={{..._this.state.divider, background:color, width}}
            onMouseDown={e => initResizeTable(e)}
         ></i>
      )
   }
   /**
   *   -----------------------------------------------------------------
   *   # OPTION FOR RENDER A TITLE FOR EACH ROW
   * 
   *     Show on each row a title column, just when the table its in 
   *     responsive mode
   *   -----------------------------------------------------------------
   *   ------> @params rowTitle | String
   *
   *   ------> @return JSX Element  | HTML Tag
   */
   static RowResponsive = ({rowTitle}) => {
      return (
         <strong className="row-responsive-table">{rowTitle}</strong>
      )
   }
   /**
   *   -----------------------------------------------------------------
   *   # OPTION FOR SHOW UNIQUE COL RESPONSIVE
   * 
   *     When is used this option just can be used 1 first time in column table
   *   -----------------------------------------------------------------
   *   ------> @params children | Object  -> React children 
   *   ------> @params colTitle | String  -> Especify the title for column
   *   ------> @params ...props | Object  -> Props ca be assigned for the user
   *
   *   ------> @return JSX Element  | HTML Tag
   */
   static uniqueColResponsive({children,colTitle,...props}) {
      return (
         <th className="col-responsive-table" {...props}>
            <strong>{ colTitle }&nbsp;&nbsp;</strong>{children}
         </th>
      )
   }
   /**
   *   -----------------------------------------------------------------
   *   # SHOW PROVISIONAL ROW WHILE THE USER MAKE AN REQUEST ON YOUR SERVER
   *   -----------------------------------------------------------------
   *   ------> @params colSpan | Integer -> For with Row in table
   *   ------> @params backGroundContainerColor[Optional] | String -> BackGround in row
   *   ------> @params text[Optional] | String -> Alternative custom text
   *   ------> @params texColor[Optional] | String -> Color for text
   *   ------> @params loadingColor[Optional] | String -> Change color for loading spinner
   *   ------> @params customComponent[Optional] | React Component -> Custom component 
   *
   *   ------> @return JSX Element | HTML Tag
   */
   static provRow({colSpan, backGroundContainerColor, text, textColor, loadingColor, customComponent}){
      return (
         <tr className="table-loading" style={backGroundContainerColor || {background:'#fff'}}>
            <td colSpan={colSpan}>
               <div style={{display:'inline-block'}}>
                  { customComponent || (
                     <>
                        <div class="spinner">
                           <div class="bounce1"></div>
                           <div class="bounce2"></div>
                           <div class="bounce3"></div>
                        </div>
                        <p style={{color: textColor || null}} className="loading-text-table">{ text || 'Loading...' }</p>
                     </>
                  ) }
               </div>
            </td>
            <style jsx="true">{`

               .spinner {
                  margin: 0px auto 0;
                  width: 70px;
                  text-align: center;
                  margin-bottom:20px;
               }

               .spinner > div {
                  width: 15px;
                  height: 15px;
                  background-color: ${loadingColor || '#ccc'};

                  border-radius: 100%;
                  display: inline-block;
                  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
                  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
               }

               .spinner .bounce1 {
                  -webkit-animation-delay: -0.32s;
                  animation-delay: -0.32s;
               }

               .spinner .bounce2 {
                  -webkit-animation-delay: -0.16s;
                  animation-delay: -0.16s;
               }

               @-webkit-keyframes sk-bouncedelay {
                  0%, 80%, 100% { -webkit-transform: scale(0) }
                  40% { -webkit-transform: scale(1.0) }
               }

               @keyframes sk-bouncedelay {
                  0%, 80%, 100% { 
                     -webkit-transform: scale(0);
                     transform: scale(0);
                  } 40% { 
                     -webkit-transform: scale(1.0);
                     transform: scale(1.0);
                  }
               }
            `}</style>
         </tr>
      )
   }
   /*
      -----------------------------------------------------------------
      # OPTION FOR FIXED HEADER COLUMN
      -----------------------------------------------------------------
   */
   fixedHeader = () => {
      this.state.table.current.querySelectorAll('th').forEach(th => {
         th.style.position='sticky';
         th.style.top='0';
         th.style.zIndex='100';
      })
   }
   render(){
      return (
         <div            
            onScroll={this.props.fixedheader==="true" ? this.fixedHeader : undefined}
            className="react-hook-custom-table"
         >
            <table 
               ref={this.state.table} 
               {...this.props} 
               onMouseMove={e => resizeTable(e)}
               onMouseUp={() => endResizeTable()}
            >
               { this.props.children }
            </table>
            <style jsx="true">{`
               .react-hook-custom-table{
                  min-height:${this.props.minheight || '350px'};
                  max-height:${this.props.maxheight || '500px'};
                  overflow:auto;
               }
               .react-hook-custom-table table {
                  min-width:100%;
                  height:auto;
               }
               
               .react-hook-custom-table table thead th{
                  position:relative;
               }
               .react-hook-custom-table thead th.col-responsive-table strong{
                     display:none;
               }
               .react-hook-custom-table table tbody tr strong.row-responsive-table{
                  display:none;
               }
               .react-hook-custom-table table tbody{
                  position:relative;
               }               
               .react-hook-custom-table table tbody tr.table-loading{
                  background: #fff !important;
                  width: 100%;
                  height:${this.props.minheight || '350px'};
                  text-align: center;
               }
               .react-hook-custom-table table tbody tr.table-loading td{
                  vertical-align: middle;
                  border-top: none;
                  height: 100%;
               }
               .react-hook-custom-table table tbody tr.table-loading p.loading-text-table{
                   color: #eee;
                   font-size:.9em;
               }
               @media (max-width:${this.props.startresponsive || 100}px) {
                  .react-hook-custom-table thead th{
                     display:none;
                  }
                  .react-hook-custom-table thead th.col-responsive-table{
                     display:table-cell;
                  }
                  .react-hook-custom-table thead th.col-responsive-table strong{
                     display:inline;
                  }
                  .react-hook-custom-table table tbody tr{
                     display:flex;
                     flex-direction:column;
                     margin:15px 0;
                  }
                   .react-hook-custom-table table tbody tr strong.row-responsive-table{
                      display:inline-block;
                      min-width:100px;
                   }
                   .react-hook-custom-table table tbody tr.table-loading{
                     height:${this.props.minheight || '350px'};                     
                   }
                   .react-hook-custom-table table tbody tr.table-loading td{
                     display:flex;
                     flex-direction:column;
                     align-items:center;
                     justify-content:center;                  
                   }
                 
               }
            `}</style>
         </div>
      )
   }
}

module.exports = Table;