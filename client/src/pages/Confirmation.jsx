import { useState } from 'react';
import { Link } from 'react-router-dom';

function Confirmation() {
  return (
    <div>
      <h1>Confirmation</h1>
      <p>Buscar otra confrontacion</p>
      <Link to="/timerpvp">Yes</Link>
      <Link to="/">No</Link>
    </div>
  );
}

export default Confirmation;