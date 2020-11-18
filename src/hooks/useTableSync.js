const React = require('react');
const { useState, useEffect } = require('react');
const { SimplePaginator, TraditionalPaginator } = require('../table/components');
const useTable = ({ columns:Columns, data, options:{initialperpage,typepaginator} }) => {
   //-> STATE    
   const [rows, setRows]                 = useState(data);
   const [columns, setColumns]           = useState(Columns.map(col => ({...col, sort:'up'})));
   const [rowsPerPage, setRowsPerPage]   = useState(initialperpage || 5);
   const [page, setPage]                 = useState(0);
   const [rowsSelected, setRowsSelected] = useState([]);
   const [orderBy, setOrderBy]           = useState('desc');
   const [search, setSearch]             = useState('');
   const [totalPages, setTotalPages]     = useState(0);
   //-> LOCAL VARIABLES
   let renderRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
   //-> COMPONENTS
   const Paginator = getPaginator();
/*
 
           __________   ___ .______     ______   .______     .___________.   .___  ___.  _______ .___________. __    __    ______    _______       _______.
          |   ____\  \ /  / |   _  \   /  __  \  |   _  \    |           |   |   \/   | |   ____||           ||  |  |  |  /  __  \  |       \     /       |
          |  |__   \  V  /  |  |_)  | |  |  |  | |  |_)  |   `---|  |----`   |  \  /  | |  |__   `---|  |----`|  |__|  | |  |  |  | |  .--.  |   |   (----`
          |   __|   >   <   |   ___/  |  |  |  | |      /        |  |        |  |\/|  | |   __|      |  |     |   __   | |  |  |  | |  |  |  |    \   \    
          |  |____ /  .  \  |  |      |  `--'  | |  |\  \----.   |  |        |  |  |  | |  |____     |  |     |  |  |  | |  `--'  | |  '--'  |.----)   |   
          |_______/__/ \__\ | _|       \______/  | _| `._____|   |__|        |__|  |__| |_______|    |__|     |__|  |__|  \______/  |_______/ |_______/    
                                                                                                                                                           
 
*/
   /**
   *   -----------------------------------------------------------------
   *   # SEARCH DATA IN OBJECT ARRAY
   *   -----------------------------------------------------------------
   *   ------> @params text | String 
   *
   *   ------> @return void
   */ 
   function _searchData(text) {      
      setRows(data.filter(row => Object.values(row).join(' ').toLowerCase().includes(text.toString().toLowerCase()))); //-> Join values to before filter
      setSearch(text);
      setPage(0);
   }
  /**
   *   -----------------------------------------------------------------
   *   # ADD "CHECKED" PROPERTY TO ROW, ITS FOR SELECT AN ROW 
   *   -----------------------------------------------------------------
   *   ------> @params e   | Event 
   *   ------> @params row | Object
   *
   *   ------> @return void
   */
   function _select(e,row) {
      let { checked } = e.target;
      let index = rows.indexOf(row);
      rows[index].checked = checked;
      getCheckedRows();
   }
   /**
   *   -----------------------------------------------------------------
   *   # ADD "CHECKED" PROPERTY TO ALL ROWS
   * 
   *   Just add "checked" property on the visible rows for the user, not
   *   in all rows
   *   -----------------------------------------------------------------
   *   ------> @params e | Event
   *
   *   ------> @return void
   */
   function _selectAll(e) {
      if(!data) return;
      const { checked } = e.target;
      renderRows.map(row => {
         return row.checked = checked
      });
      getCheckedRows();
   }
   /**
   *   -----------------------------------------------------------------
   *   # ADD "SORT" PROPERTY TO COLUMN FOR SPIN ORDER ICON
   *   -----------------------------------------------------------------
   *   ------> @params id | Int
   *
   *   ------> @return void
   */
   function _sortBy({id, numeric}) {
      let orderRows;
        //-> Evitar que cuando el usuario este buscando algo y se 
        //   actualize un registro se quede en el mismo lugar donde lo dejo
        search !== '' ? orderRows = rows : orderRows = data;

        orderBy === 'asc' ?
        numeric ?
            setRows(orderRows.sort( (a,b) => Number(a[id]) > Number(b[id]))) : 
            setRows(orderRows.sort( (a,b) => a[id].toLowerCase() > b[id].toLowerCase()))   
        :
            numeric ?
            setRows(orderRows.sort( (a,b) => Number(a[id]) < Number(b[id]))) :
            setRows(orderRows.sort( (a,b) => a[id].toLowerCase() < b[id].toLowerCase()))   
        
        setOrderBy( orderBy === 'asc' ? 'desc' : 'asc' );
        setColumns(columns.map(col => {
           return col.id === id ? {...col, sort: col.sort === 'up' ? 'down' : 'up'} : {...col, sort:'up'}
        }))
        setPage(0); 
   }
   /**
   *   -----------------------------------------------------------------
   *   # SHOW PAGES SELECTED FOR THE USER
   *   -----------------------------------------------------------------
   *   ------> @params quantity | Integer
   *
   *   ------> @return void
   */
   function _showPerPage(quantity = 5){
      setRowsPerPage(quantity);
   }
   /**
   *   -----------------------------------------------------------------
   *   # GO TO THE PAGE SELECTED FOR TE USER
   *   -----------------------------------------------------------------
   *   ------> @params number | Integer
   *
   *   ------> @return void
   */
   function _goToPage(number) {
      if (isNaN(number)) return console.error('page must be a number');
      if (number > totalPages - 1) return setPage(totalPages -1);
      if (number <= 0) return setPage(0);
      setPage(number -1);
   }
   /**
   *   -----------------------------------------------------------------
   *   # RETURN OBJECT WITH ALL CURRENT PAGE DATA 
   *     
   *     This method is a complement of method paginator and can be used
   *     for get statics of pagination
   *   -----------------------------------------------------------------
   *
   *   ------> @return Object
   */
   function _currentPageData() {
      let first = rows.length > 1 ? (page * rowsPerPage) + 1 : 0;
      let last = renderRows.length < rowsPerPage ? rows.length : (page * rowsPerPage) + rowsPerPage ;

      return {
         first,
         last,
         current: page,
         total: rows.length
      }
   }
   /**
   *   -----------------------------------------------------------------
   *   # RETURN OBJECT WITH ALL PROPERTIES FOR AN CUSTOM PAGINATION
   *   -----------------------------------------------------------------
   *   ------> @params offset | Int -> Offset for quantity items visibles in paginator
   *
   *   ------> @return Object
   */
   function _paginator( offset= 2 ) {
      let arrayPages = [];
      let from = page - offset;
      let to = from + (offset * 2);
      if(from < 1) from = 0;
      if(to >= totalPages) to = totalPages - 1;

      while(from <= to){
         arrayPages.push(from + 1);
         from ++;
      }
      return {
         backDisabled : page <= 0 ? true : false,
         showFirstItem: page > offset ? true : false,
         goBack       : goBack,
         nextDisabled : page >= totalPages - 1 ? true : false,
         showLastItem : page < totalPages - offset - 1 ? true: false,
         goNext       : goNext,
         items        : arrayPages,
         goFisrt      : goFirst,
         goLast       : goLast,
         goToPage     : _goToPage,
         currentPage  : page + 1,
         lastPage     : totalPages,
      }
   }
/*
 
           __  .__   __. .___________. _______ .______      .__   __.      ___       __         .___  ___.  _______ .___________. __    __    ______    _______       _______.
          |  | |  \ |  | |           ||   ____||   _  \     |  \ |  |     /   \     |  |        |   \/   | |   ____||           ||  |  |  |  /  __  \  |       \     /       |
          |  | |   \|  | `---|  |----`|  |__   |  |_)  |    |   \|  |    /  ^  \    |  |        |  \  /  | |  |__   `---|  |----`|  |__|  | |  |  |  | |  .--.  |   |   (----`
          |  | |  . `  |     |  |     |   __|  |      /     |  . `  |   /  /_\  \   |  |        |  |\/|  | |   __|      |  |     |   __   | |  |  |  | |  |  |  |    \   \    
          |  | |  |\   |     |  |     |  |____ |  |\  \----.|  |\   |  /  _____  \  |  `----.   |  |  |  | |  |____     |  |     |  |  |  | |  `--'  | |  '--'  |.----)   |   
          |__| |__| \__|     |__|     |_______|| _| `._____||__| \__| /__/     \__\ |_______|   |__|  |__| |_______|    |__|     |__|  |__|  \______/  |_______/ |_______/    
                                                                                                                                                                              
 
*/
   /*
      -----------------------------------------------------------------
      # GO BACK PAGE
      -----------------------------------------------------------------
   */
   function goBack() {
      setPage(page - 1 <= 0 ? 0 : page - 1);
   }
   /*
      -----------------------------------------------------------------
      # GO NEXT PAGE
      -----------------------------------------------------------------
   */
   function goNext() {
      setPage(page + 1 >= totalPages - 1 ? totalPages - 1 : page + 1);
   }
   /*
      -----------------------------------------------------------------
      # GO FIRST PAGE
      -----------------------------------------------------------------
   */
   function goFirst(){
      setPage(0);
   }
   /*
      -----------------------------------------------------------------
      # GO LAST PAGE
      -----------------------------------------------------------------
   */
   function goLast(){
      setPage(totalPages - 1);
   }
    /*
      -----------------------------------------------------------------
      # GET AND ADD ALL CHECKED ROWS
      -----------------------------------------------------------------
   */
   function getCheckedRows() {
      let rws = rows.filter(row => row.checked ? row : null);
      setRowsSelected(rws)
   }
   /*
      -----------------------------------------------------------------
      # GET A PAGINATOR COMPONENT CAN BE "SIMPLE" OR "TRADITINAL"
      -----------------------------------------------------------------
   */
   function getPaginator() {
      if(!typepaginator) return null;
      if(typepaginator === 'simple')
         return (<SimplePaginator totalPages={totalPages} setPage={setPage} page={page}/>);
      else if (typepaginator === 'traditional')
         return (<TraditionalPaginator totalPages={totalPages} setPage={setPage} page={page}/>)
      else
         console.error(`type paginator "${typepaginator}" not recognized choice 'simple' or 'traditional'`);
         return null;
   }
   /*
      -----------------------------------------------------------------
      # GET ROWS FOR SHOW THE USER
      -----------------------------------------------------------------
   */
   function getRows(){
      return renderRows;
   } 

   useEffect( () => {       
        setTotalPages(Math.ceil(data.length / rowsPerPage));
        setRows(search ? rows : data);        
        getCheckedRows();
        if( data && renderRows.length <=0 ) setPage( page <= 0 ? 0 : page -1);
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    },[data,rows,page,rowsPerPage]);
    //},[data,rows,,page,rowsPerPage,rowsSelected,orderBy,totalPages]);
   /*
      -----------------------------------------------------------------
      # DATA RETURNED FOR BE USED IN HOOK
      -----------------------------------------------------------------
   */
   return {
      rows   : getRows(),     //-> Rows rendered
      cols   : columns,       //-> Columns rendered
      methods: {
      _select,
      _selectAll,
      _sortBy,
      _searchData,
      _showPerPage,
      _goToPage,
      _currentPageData,
      _paginator
      },
      variables:{
      currentPage: page,      //-> Show current page to the user
      rowsSelected,           //-> Show all rows selected to the user
      currentSearch: search,  //-> Show text current search made for the user
      },
      components:{
      Paginator: () => Paginator,
      }
   }
}

module.exports = useTable;

/*  useMemo(() => {
         setRows(search ? rows : data);        
         // eslint-disable-next-line react-hooks/exhaustive-deps 
   },[data,search,rowsSelected]);    
 */