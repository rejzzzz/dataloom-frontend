import { BrowserRouter } from "react-router-dom";
import Providers from "@/components/Providers";
import AppRoutes from "@/routes";

const App = () => (
    <Providers>
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    </Providers>
);

export default App;
