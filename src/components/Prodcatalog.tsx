import axios from "axios"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const api = axios.create({
  baseURL: "https://localhost:7292",
  headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'}
})

interface Productdata {
  totpage: string,
  page: string,
  products: Products
}

interface Products {
  id: number,
  descriptions: string,  
  qty: number,
  unit: string,
  sellPrice: number,
  productPicture: string
}

const toDecimal = (number: any) => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2, // Ensures at least two decimal places
    maximumFractionDigits: 2, // Limits to two decimal places
  });
  // Format the number
  return formatter.format(number);
};
export default function Prodcatalog() {
    let [page, setPage] = useState<number>(1);
    let [prods, setProds] = useState<Products[]>([]);
    let [totpage, setTotpage] = useState<number>(0);
    const [message, setMessage] = useState('');

    const fetchCatalog = async (pg: any) => {
      api.get<Productdata>(`/api/listproducts/${pg}`)
      .then((res: any) => {
        const data: Productdata = res.data;
        setProds(data.products);
        setTotpage(data.totpage);
        setPage(data.page);
      }, (error: any) => {
              setMessage(error.response.data.message);
              return;
      });      
    }

    useEffect(() => {
      fetchCatalog(page)
    },[page]);

    const firstPage = (event: any) => {
        event.preventDefault();    
        page = 1;
        setPage(page);
        fetchCatalog(page);
        return;    
      }
    
      const nextPage = (event: any) => {
        event.preventDefault();    
        if (page === totpage) {
            return;
        }
        setPage(page++);
        fetchCatalog(page);
        return;
      }
    
      const prevPage = (event: any) => {
        event.preventDefault();    
        if (page === 1) {
          return;
          }
          setPage(page--);
          fetchCatalog(page);
          return;    
      }
    
      const lastPage = (event: any) => {
        event.preventDefault();
        page = totpage;
        setPage(page);
        fetchCatalog(page);
        return;    
      }

    return(
    <div className="container mt-2 mb-9">
            <h3 className="text-success embossed mt-3">Products Catalog</h3>
            <div className="card-group mb-3">
            {prods.map((item) => {
                    return (
                      <div className='col-md-4'>
                      <div key={item.id} className="card mx-3 mt-3">
                          <img src={item['productPicture']} className="card-img-top product-size" alt=""/>
                          <div className="card-body">
                            <h5 className="card-title">Descriptions</h5>
                            <p className="card-text desc-h">{item['descriptions']}</p>
                          </div>
                          <div className="card-footer">
                            <p className="card-text text-danger"><span className="text-dark">PRICE :</span>&nbsp;<strong>&#8369;{toDecimal(item['sellPrice'])}</strong></p>
                          </div>  
                      </div>
                      
                      </div>
        
                      );
            })}
          </div>    

        <div className='container'>
        <nav aria-label="Page navigation example">
        <ul className="pagination sm">
          <li className="page-item"><Link onClick={lastPage} className="page-link sm" to="/#">Last</Link></li>
          <li className="page-item"><Link onClick={prevPage} className="page-link sm" to="/#">Previous</Link></li>
          <li className="page-item"><Link onClick={nextPage} className="page-link sm" to="/#">Next</Link></li>
          <li className="page-item"><Link onClick={firstPage} className="page-link sm" to="/#">First</Link></li>
          <li className="page-item page-link text-danger sm">Page&nbsp;{page} of&nbsp;{totpage}</li>
        </ul>
      </nav>
      <br/><br/>
      </div>
  </div>
  )
}
