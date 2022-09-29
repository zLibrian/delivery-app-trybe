import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function SaleDetailsCard() {
  const saleDataTestId = 'seller_order_details__element-order-details-label';
  const saleTableTestId = 'seller_order_details__element-order-table';
  const { id } = useParams();
  const [saleState, setSaleState] = useState([]);
  useEffect(() => {
    const fetchSale = async () => {
      const response = await fetch(`http://localhost:3001/orders/${id}`);
      const data = await response.json();
      setSaleState(data);
    };
    fetchSale();
  }, [id]);

  return (
    <div>
      {!saleState.length ? <p>Loading...</p> : saleState.map((sale) => (
        <div key={ sale.id }>
          <h1
            data-testid={ `${saleDataTestId}-order-${sale.id}` }
          >
            {sale.id}
          </h1>
          <p
            data-testid={ `${saleDataTestId}-order-date` }
          >
            {new Date(sale.saleDate).toLocaleDateString('pt-BR')}

          </p>
          <p
            data-testid={ `${saleDataTestId}-delivery-status` }
          >
            {sale.status}
          </p>
          <button
            data-testid="seller_order_details__button-preparing-check"
            type="button"
          >
            Preparar pedido

          </button>
          <button
            data-testid="seller_order_details__button-dispatch-check"
            type="button"
          >
            Saiu para entrega

          </button>
          <div>
            {sale.products.map((item, index) => (
              <div key={ item.id } className="salecard-card">
                <p
                  data-testid={ `${saleTableTestId}-item-number-${index}` }
                >
                  {index + 1}

                </p>
                <p
                  data-testid={ `${saleTableTestId}-name-${index}` }
                >
                  {item.name}

                </p>
                <p
                  data-testid={ `${saleTableTestId}-quantity-${index}` }
                >
                  {item.prodQty.quantity}

                </p>
                <p
                  data-testid={ `${saleTableTestId}-unit-price-${index}` }
                >
                  {item.price.replace('.', ',')}

                </p>
                <p
                  data-testid={ `${saleTableTestId}-sub-total-${index}` }
                >
                  {(item.price * item.prodQty.quantity).toFixed(2).replace('.', ',')}

                </p>
              </div>
            ))}
          </div>
          <p
            data-testid="seller_order_details__element-order-total-price"
          >
            {saleState[0].totalPrice.replace('.', ',')}

          </p>
        </div>
      ))}
    </div>
  );
}

export default SaleDetailsCard;
