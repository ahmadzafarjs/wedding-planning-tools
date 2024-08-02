import { GiDiamondRing } from "react-icons/gi";
import { GoChecklist } from "react-icons/go";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { SlCalculator } from "react-icons/sl";
import { Link } from "react-router-dom";

const style =
  "flex flex-col items-center justify-center gap-1 px-3 py-3  border-pink-400 hover:text-pink-500 ";

export default function SecNavigation() {
  return (
    <nav className=" flex items-center justify-center gap-8 shadow-md">
      <Link to="/" className={`${style}`}>
        <span>
          <GiDiamondRing className="text-3xl text-slate-600" />
        </span>
        <p className="">My wedding</p>
      </Link>
      <Link to="checklist" className={`${style}`}>
        <span>
          <GoChecklist className="text-3xl text-slate-600" />
        </span>
        <p>Checklist</p>
      </Link>
      <Link to="guests" className={`${style}`}>
        <span>
          <MdOutlinePeopleAlt className="text-3xl text-slate-600" />
        </span>
        <p>Guest list</p>
      </Link>
      <Link to="budget" className={`${style}`}>
        <span>
          <SlCalculator className="text-3xl text-slate-600" />
        </span>
        <p>Budget</p>
      </Link>
    </nav>
  );
}
