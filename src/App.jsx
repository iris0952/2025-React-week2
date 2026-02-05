import { useState } from 'react'
import axios from "axios";
import "./assets/style.css";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [isAuth, setIsAuth] = useState(false);

  const [products, setProduct] = useState([]);
  const [tempProduct, setTempProduct] = useState();

  function handleInputChange(e) {
    const { name, value } = e.target ;
    console.log(name, value);
    setFormData({
      ...formData, //可以取得原本的值
      [name]: value
    })
  }
  
  const getProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`); 
      console.log(res.data);
      setProduct(res.data.products)
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const submitForm = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      console.log(res.data);
      //設定 cookie
      const { token, expired} = res.data;
      document.cookie = `camiToken=${token};expires=${new Date(expired)};`
      // 修改實體建立時所指派的預設配置
      axios.defaults.headers.common['Authorization'] = token;
      setIsAuth(true);
      getProducts();
    } catch (error) {
      console.dir(error);
      setIsAuth(false);
    }
  }

  const checkLogin = async () => {
    try {
      // 讀取 Cookie
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("camiToken="))
        ?.split("=")[1];
      // 修改實體建立時所指派的預設配置
      axios.defaults.headers.common['Authorization'] = token;

      const res = await axios.post(`${API_BASE}/api/user/check`);
      console.log(res.data);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
    }
  }

  return (
    <>
      { ! isAuth ? (
        <div className="container login">
          <h2 className='text-secondary'>寵物攝影館</h2>
          <form className="form-floating" onSubmit={(e) => submitForm(e)}>
            <div className="form-floating mb-3">
              <input 
                type="email" 
                name='username' 
                className="form-control" 
                id="floatingInput" 
                placeholder="name@example.com" 
                value={formData.username} 
                onChange={(e)=>handleInputChange(e)}
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
              <input 
                type="password" 
                name='password' 
                className="form-control" 
                id="floatingPassword" 
                placeholder="Password"
                value={formData.password}
                onChange={(e)=>handleInputChange(e)}
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <button type="submit" className="btn btn-success w-100 mt-3">登入</button>
          </form>
        </div>
      ) : (
        <div className="container">
          <div className="row mt-5">
            <div className="col-6">
              <button
                className="btn btn-danger mb-5"
                type="button"
                onClick={() => checkLogin()}
              >
                確認是否登入
              </button>
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    products.map(product => (
                      <tr key={product.id}>
                        <th scope="row">{product.title}</th>
                        <td>{product.origin_price}</td>
                        <td>{product.price}</td>
                        <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
                        <td><button type="button" className="btn btn-primary btn-sm" onClick={() => setTempProduct(product)}>查看細節</button></td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            <div className="col-6">
              <h2>產品細節</h2>
              {
                tempProduct ? (
                  <div className="card">
                    <img src={tempProduct.imageUrl} style={{height: '300px'}} className="card-img-top" alt="主圖"/>
                    <div className="card-body">
                      <h5 className="card-title">{tempProduct.title}</h5>
                      <p className="card-text">分類：{tempProduct.category}</p>
                      <p className="card-text">商品尺寸：{tempProduct.content}</p>
                      <p className="card-text">原價 / 售價：<span className="text-black-50 text-decoration-line-through">{tempProduct.origin_price} </span>/ {tempProduct.price}</p>
                      <p className="card-text">{tempProduct.description}</p>
                      <h5 className="card-title">更多圖片</h5>
                      <div className="d-flex flex-wrap gap-2">
                        {/* 確保 tempProduct.imagesUrl 存在且為陣列 */}
                        {Array.isArray(tempProduct?.imagesUrl) && tempProduct.imagesUrl.map((url, index) => (
                          <img 
                            key={index} 
                            src={url} 
                            style={{height: "100px"}} 
                            className="card-img-top img-small" 
                            alt="副圖"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (<p>請選擇一個產品</p>)
              }
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
