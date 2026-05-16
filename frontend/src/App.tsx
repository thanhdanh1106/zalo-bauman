import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Provider } from "react-redux";
import { ToasterProvider } from "@shared/components/ToasterContext";
import DataSync from "@shared/components/DataSync";
import PopupManager from "@shared/components/PopupManager";
import Router from "./Router";
import { store } from "@shared/store";

function AppLayout() {
  return (
    <Provider store={store}>
       <ToasterProvider>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="en-gb">
              <DataSync />
              <Router />
          </LocalizationProvider>
        </ToasterProvider>
    </Provider>
  );
}

export default AppLayout;
