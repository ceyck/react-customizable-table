const { useState, useEffect } = require('react');

const useTableAsync = ({cols,data,options:{totalPages,currentPage,totalItems,rowsPerPage}}) => {
   const [rows, setRows] = useState(data || []);
   const [columns, setColumns]           = useState(cols.map(col => ({...col, sort:'up'})));   
   const [rowsSelected, setRowsSelected] = useState([]);
   /**
   *   -----------------------------------------------------------------
   *   # ADD "SORT" PROPERTY TO COLUMN FOR SPIN ORDER ICON
   *   -----------------------------------------------------------------
   *   ------> @params id | Int
   *
   *   ------> @return void
   */
   function _sortBy({id}){
      setColumns(columns.map(col => {
         return col.id === id ? {...col, sort: col.sort === 'up' ? 'down' : 'up'} : {...col, sort:'up'}
      }))
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
   function _seletAll(e){
      if(!data) return;
      const { checked } = e.target;
      rows.map(row => {
         return row.checked = checked
      });
      getCheckedRows();
   }
   /**
   *   -----------------------------------------------------------------
   *   # RETURN OBJECT WITH ALL PROPERTIES FOR AN CUSTOM PAGINATION
   *   -----------------------------------------------------------------
   *   ------> @params offset | Int -> Offset for quantity items visibles in paginator
   *
   *   ------> @return Object
   */
   function _paginator( offset ) {
      let arrayPages = [];
      let from = currentPage - offset;
      let to = from + (offset * 2);
      if(from < 1) from = 0;
      if(to >= totalPages) to = totalPages - 1;

      while(from <= to){
         arrayPages.push(from + 1);
         from ++;
      }
      return{
         backDisabled:currentPage <= 1 ? true : false,
         showFirstItem: currentPage > offset ? true : false,
         nextDisabled: currentPage >= totalPages  ? true : false,
         showLastItem: currentPage < totalPages - offset - 1 ? true : false,
         items:arrayPages,
         totalPages,
         offset,
         totalItems
      }
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
      let first = rows.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
      let last = rows.length < rowsPerPage ? totalItems : (currentPage - 1) * rowsPerPage + rowsPerPage;
      
      return {
         first,
         last,
         current:currentPage,
         totalItems,
      }   
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
   useEffect(() => {
      setRows(data)
      let hasChecked = data.filter(row => row.checked === true ? row : null);
      
      if(hasChecked) {
         setRowsSelected(hasChecked)
      }else{
         setRowsSelected([])
      }
   },[data]);
   /*
      -----------------------------------------------------------------
      # DATA RETURNED FOR BE USED IN HOOK
      -----------------------------------------------------------------
   */
   return {
      rows,                   //-> Rows rendered
      columns,                //-> Columns rendered
      methods:{   
         _select,
         _sortBy,
         _seletAll,
         _paginator,
         _currentPageData,
      },
      variables:{
         rowsSelected,        //-> Get all rows selected
      }
   }
}

module.exports = useTableAsync;