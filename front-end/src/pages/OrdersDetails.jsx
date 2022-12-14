import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLoginContext } from '../context/LoginContext';
import api from '../services';
import '../styles/pages/orderDetails.css';

const { serializeDate, serializePrice } = require('../utils');

function OrdersDetails() {
  const { userOrders, setUserOrders } = useLoginContext();
  const [sellers, setSellers] = useState({});
  const [disable, setDisable] = useState(true);
  const [classStatus, setClassStatus] = useState('Pendente');
  const { id } = useParams();
  const testIdsTable = 'customer_order_details__element-order-table';
  const testIdStatus = 'customer_order_details__element-order';

  const getSellersById = (idSeller) => {
    api.get(`/login/sellers/${idSeller}`)
      .then((response) => {
        const { data } = response;
        setSellers(data);
      })
      .catch((err) => err.response.data);
  };

  const disableButton = (status) => setDisable(status !== 'Em Trânsito');

  const ordersById = () => {
    api.get(`/orders/${id}`)
      .then((response) => {
        const { data } = response;
        setClassStatus(data[0].status === 'Em Trânsito' ? 'em-transito' : data[0].status);
        disableButton(data[0].status);
        getSellersById(data[0].sellerId);
        setUserOrders(data);
      })
      .catch((err) => err.response.data);
  };

  useEffect(() => {
    ordersById();
  }, []);

  const setOrderStatus = (status) => {
    api.patch(`/orders/${id}`, { status })
      .then(ordersById)
      .catch((err) => err.response.data);
  };

  return (
    <section className="section-details">
      <h2>Detalhes do pedido</h2>
      <div className="infos-container">
        <h4 data-testid="customer_order_details__element-order-details-label-order-id">
          {`Pedido ${id}`}
        </h4>
        <h4
          data-testid="customer_order_details__element-order-details-label-seller-name"
        >
          { userOrders.length === 0 && !sellers
            ? ''
            : `P. Vend: ${sellers.name}`}
        </h4>
        <h4
          data-testid="customer_order_details__element-order-details-label-order-date"
        >
          { userOrders.length === 0
            ? ''
            : serializeDate(userOrders[0].saleDate)}
        </h4>
        <h4
          className={ classStatus }
          data-testid={ `${testIdStatus}-details-label-delivery-status` }
        >
          { userOrders.length === 0 ? '' : userOrders[0].status}
        </h4>
        <button
          className="delivery-button"
          type="button"
          disabled={ disable }
          data-testid="customer_order_details__button-delivery-check"
          onClick={ () => setOrderStatus('Entregue') }
        >
          Marcar como entregue
        </button>
      </div>
      <table className="table-orders">
        <thead>
          <tr>
            <th>Item</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Valor Unitário</th>
            <th>Sub-Total</th>
          </tr>
        </thead>
        <tbody>
          {
            userOrders.length === 0
              ? ''
              : userOrders[0].products.map(
                ({ id: prodId, name, prodQty, price }, index) => (
                  <tr key={ prodId }>
                    <td
                      data-testid={ `${testIdsTable}-item-number-${index + 1}` }
                    >
                      {index + 1}
                    </td>
                    <td
                      data-testid={ `${testIdsTable}-name-${index + 1}` }
                    >
                      {name}
                    </td>
                    <td
                      data-testid={ `${testIdsTable}-quantity-${index + 1}` }
                    >
                      {prodQty.quantity}
                    </td>
                    <td
                      data-testid={ `${testIdsTable}-unit-price-${index + 1}` }
                    >
                      {serializePrice(price)}
                    </td>
                    <td
                      data-testid={ `${testIdsTable}-sub-total-${index + 1}` }
                    >
                      {serializePrice((prodQty.quantity * price).toFixed(2))}
                    </td>
                  </tr>
                ),
              )
          }
        </tbody>
      </table>
      <div
        className="total-price-order"
        data-testid="customer_order_details__element-order-total-price"
      >
        { userOrders.length === 0
          ? ''
          : <p>{ `Total: R$ ${serializePrice(userOrders[0].totalPrice)}` }</p> }
      </div>
    </section>
  );
}

export default OrdersDetails;
