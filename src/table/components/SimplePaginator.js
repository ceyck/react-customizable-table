const React = require('react');

const SimplePaginator = ({ totalPages, setPage, page }) =>{
   return (
      <div>
         <ul>
            <li>
               <button disabled={page === 0 ? 'disabled' : ''} onClick={() => setPage(0)}>
                  <span>&#x0226A;</span>
               </button>
            </li>
            <li>
               <button disabled={page === 0 ? 'disabled' : ''} onClick={() => setPage(page - 1)}>
                  <span>&#x02264;</span>
               </button>
            </li>
            <li>
               <button disabled={page === totalPages - 1 ? 'disabled' : ''} onClick={() => setPage(page + 1)}>
                  <span>&#x02265;</span>
               </button>
            </li>
            <li>
               <button disabled={page === totalPages - 1 ? 'disabled' : ''} onClick={() => setPage(totalPages - 1)}>
                  <span>&#x0226B;</span>
               </button>
            </li>
         </ul>
         <style jsx="true" scoped>{`
            div ul{
               display:flex;
               list-style:none;
            }
         `}</style>
      </div>
   )
}

module.exports = SimplePaginator;