import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  fullName: string;
  nomPoste: string;
  id: number;
}

const TafkidimCard: React.FC<Props> = ({ fullName, nomPoste, id }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/lead-details/${id}`);
  };

  return (
    <div
      className="border rounded p-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={handleClick}
    >
      <div className="font-semibold">{fullName}</div>
      <div className="text-sm text-gray-600">{nomPoste}</div>
    </div>
  );
};

export default TafkidimCard;
