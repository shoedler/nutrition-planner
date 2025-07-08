import { Header } from "../components/Header.tsx";
import SelectionList from "../islands/SelectionList.tsx";

export default function Home() {
  return (
    <div className="p-5">
      <Header />
      <SelectionList />
    </div>
  );
}
