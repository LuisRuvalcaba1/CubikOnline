import { useEffect, useState } from "react";
import { useAuthTorneo } from "../context/TorneoContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import { useAuth } from "../context/AuthContext";

function WaitRound() {
  return (
    <div>
      <h1>WaitRound</h1>
    </div>
  );
}

export default WaitRound;