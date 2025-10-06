import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
export default function Prodlist() {

  const toDecimal = (number: any) => {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2, // Ensures at least two decimal places
      maximumFractionDigits: 2, // Limits to two decimal places
    });
    // Format the number
    return formatter.format(number);
  };

    let [page, setPage] = useState<number>(1);
    let [totpage, setTotpage] = useState<number>(0);
    let [products, setProducts] = useState<Productdata[]>([]);

    const fetchProducts = async (pg: any) => {
      api.get<Productdata>(`/api/listproducts/${pg}`)
      .then((res: any) => {
        const data: Productdata = res.data;
        setProducts(data.products);
        setTotpage(data.totpage);
        setPage(data.page);
      }, (error: any) => {
              console.log(error.response.data.message);
              return;
      });      
    }

    useEffect(() => {
      fetchProducts(page);
   },[page]);

    const firstPage = (event: any) => {
        event.preventDefault();    
        page = 1;
        setPage(page);
        fetchProducts(page);
        return;    
      }
    
      const nextPage = (event: any) => {
        event.preventDefault();    
        if (page === totpage) {
            return;
        }
        setPage(page++);
        fetchProducts(page);
        return;
      }
    
      const prevPage = (event: any) => {
        event.preventDefault();    
        if (page === 1) {
          return;
          }
          setPage(page--);
          fetchProducts(page);
          return;    
      }
    
      const lastPage = (event: any) => {
        event.preventDefault();
        page = totpage;
        setPage(page);
        fetchProducts(page);
        return;    
      }  
  
  return (
    <div className="container">
            <h1 className='text-success embossed mt-3'>Products List</h1>

            <table className="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Descriptions</th>
                <th scope="col">Qty</th>
                <th scope="col">Unit</th>
                <th scope="col">Price</th>
                </tr>
            </thead>
            <tbody>

            {products.map((item) => {
            return (
              <tr key={item.id}>
                 <td>{item['id']}</td>
                 <td>{item['descriptions']}</td>
                 <td>{item['qty']}</td>
                 <td>{item['unit']}</td>
                 <td>&#8369;{toDecimal(item['sellPrice'])}</td>
               </tr>
              );
            })}

            </tbody>
            </table>

            <nav aria-label="Page navigation example">
        <ul className="pagination sm">
          <li className="page-item"><Link onClick={lastPage} className="page-link sm" to="/#">Last</Link></li>
          <li className="page-item"><Link onClick={prevPage} className="page-link sm" to="/#">Previous</Link></li>
          <li className="page-item"><Link onClick={nextPage} className="page-link sm" to="/#">Next</Link></li>
          <li className="page-item"><Link onClick={firstPage} className="page-link sm" to="/#">First</Link></li>
          <li className="page-item page-link text-danger sm">Page&nbsp;{page} of&nbsp;{totpage}</li>

        </ul>
      </nav>
    </div>    
  )
}
