import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLoginContext } from '../context/LoginContext';

export default function Header() {
  const { userInfo, setUserInfo } = useLoginContext();

  useEffect(() => {
    const userData = () => {
      setUserInfo(JSON.parse(localStorage.getItem('user')));
    };

    userData();
  }, [setUserInfo]);

  return (
    <header className="header-container">
      <div className="header-buttons">
        <nav>
          <Link
            to="/products"
            data-testid="customer_products__element-navbar-link-products"
          >
            Produtos
          </Link>
          <Link
            to="/orders"
            data-testid="customer_products__element-navbar-link-orders"
          >
            Meus pedidos
          </Link>
        </nav>
      </div>
      <h1 data-testid="customer_products__element-navbar-user-full-name">
        { userInfo.name }
      </h1>
      <nav>
        <Link
          to="/login"
          data-testid="customer_products__element-navbar-link-logout"
          onClick={ () => localStorage.clear() }
        >
          Sair
        </Link>
      </nav>
    </header>
  );
}
