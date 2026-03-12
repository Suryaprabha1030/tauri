"use client";
import { useContext, useEffect, useState } from "react";
import { UserApi, UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { CommonTokenRequest } from "@/lib/api/base";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../shared/loading/Loading";
import { useDispatch } from "react-redux";
import { AuthContext } from "@/context/authContextProvider";
import { removeJwtCookie, setJwtCookie } from "@/lib/util/cookies";
import zApi from "@/lib/api/zApi";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import config from "@/lib/config";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

interface ConnectBrokerProps {
  [key: string]: string;
}

function ConnectBroker(props: ConnectBrokerProps) {
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [brokerCode, setBrokerCode] = useState("");
  const router = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loginSuccess } = useContext(AuthContext);
  const userApi = new UserApi(baseConfig());
  const apiClient = new zApi(useNavigate(), useContext(AuthContext));
  const [callProfile, setCallProfile] = useState(false);
  const url = config.apiUrl;
  const commonTokenRequest: CommonTokenRequest = {
    auth_token: props.auth_token || "",
    refresh_token: props.refresh_token || props.requestToken || "",
    feed_token: props.feed_token || "",
    request_token: props.request_token || "",
    auth_code:
      props.auth_code || props.authcode || props.authCode || props.code,
  };
  const { brokerName, ...restParams } = props;
  if ("requestToken" in restParams) {
    restParams.request_token = restParams.requestToken;
    delete restParams.requestToken;
  }
  if (
    "auth_code" in restParams ||
    "authcode" in restParams ||
    "authCode" in restParams ||
    "code" in restParams
  ) {
    restParams.auth_code =
      restParams.auth_code ??
      restParams.authcode ??
      restParams.authCode ??
      restParams.code;
    delete restParams.authcode;
    delete restParams.authCode;
    delete restParams.code;
  }
  if ("clientid" in restParams || "userId" in restParams) {
    restParams.client_code = restParams.clientid ?? restParams.userId;
    delete restParams.clientid;
    delete restParams.userId;
  }

  const shouldConnect =
    brokerName &&
    (commonTokenRequest.auth_token ||
      commonTokenRequest.refresh_token ||
      commonTokenRequest.feed_token ||
      commonTokenRequest.request_token ||
      commonTokenRequest.auth_code);

  const connectApi = new UserBrokerRouterApi(baseConfig());

  const connectAuthenticated = async () => {
    try {
      setStatus("loading");
      const response =
        await connectApi.connectMyBrokerByNameV1UsersMeBrokersByNameBrokerNameConnectPost(
          brokerName!,
          restParams,
        );
      const code = response?.data?.user_broker_mapping?.broker_code;
      const apiKey = response?.data?.broker_meta?.api_key;
      localStorage.setItem("api_key", apiKey);
      localStorage.setItem("brokerCode", brokerCode);
      setBrokerCode(code);
      setStatus("success");
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  };

  const connectUnauthenticated = async () => {
    try {
      setStatus("loading");
      const response =
        await connectApi.connectMyBrokerByNameUnauthorizedV1UsersMeBrokersByNameBrokerNameBrokerConnectPost(
          brokerName!,
          restParams,
        );

      const brokerCode = response?.data?.user_broker_mapping?.broker_code;
      const apiKey = response?.data?.broker_meta?.api_key;
      const accessToken = response?.data?.access_token;
      removeJwtCookie();
      setJwtCookie(accessToken);
      loginSuccess(accessToken);
      if (brokerCode && apiKey) {
        setBrokerCode(brokerCode);
        localStorage.setItem("brokerCode", brokerCode);
        setStatus("success");
        setCallProfile(true);
      }
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (shouldConnect) {
      if (isAuthenticated) {
        connectAuthenticated();
      } else {
        connectUnauthenticated();
      }
    } else {
      setStatus("error");
      setErrorMessage("Broker ID or token is missing.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]); // Run once only

  const getProfileData = async () => {
    apiClient.request(
      () => userApi.readMeV1UsersMeGet(),
      (response) => {
        if (
          response?.data?.first_name == null ||
          response?.data?.last_name == null ||
          response?.data?.phone_number == null
        ) {
          router("/trading-style");
          return;
        }

        if (response?.data?.is_confirmed == false) {
          router("/need-confirmation");
          return;
        }

        router(config.brokersListUrl);
      },
      (error) => {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      },
    );
  };

  useEffect(() => {
    if (status === "success" && brokerCode) {
      if (window.opener) {
        window.opener.postMessage(
          `authentication_success_${brokerCode}`,
          "*", // Use specific origin if known
        );
        window.close();
      } else {
        if (callProfile == true) {
          getProfileData();
          setCallProfile(false);
        } else {
          router(`${config.brokersListUrl}/${brokerCode}/psv`);
        }
      }
    }
  }, [status, brokerCode, router]);

  return (
    <main>
      <div>
        {status === "idle" && <p>Waiting for query parameters...</p>}
        {status === "loading" && <LoadingComponent />}
        {status === "error" && (
          <p>
            Failed to connect broker. <br />
            Error: {errorMessage}
          </p>
        )}
      </div>
    </main>
  );
}

export default ConnectBroker;
