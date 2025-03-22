interface MahzorGiyusCardProps {
  count: number;
  period: string;
  colorClass?: string;
  textColor?: string;

  onClick?: () => void;
}

const MahzorGiyusCard: React.FC<MahzorGiyusCardProps> = ({
  count,
  period,
  colorClass = "bg-indigo-900",
  textColor = "text-black",
  onClick,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden w-80 h-48 flex flex-col items-center border cursor-pointer"
      onClick={onClick}
    >
      <div
        className={` ${textColor} text-3xl font-bold  flex-grow flex items-center justify-center`}
      >
        {count}
      </div>
      <div
        className={`${colorClass} text-white text-sm font-semibold p-2 w-full h-12 flex items-center justify-center text-center`}
      >
        {period}
      </div>
    </div>
  );
};

export default MahzorGiyusCard;
