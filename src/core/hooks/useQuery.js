import { useEffect, useReducer } from "react";
import { queryReducer } from "../reducers/queryReducer";
import { apiClient } from "../utils/apiClient";
import { useCallback } from "react";
import { useMemo } from "react";

const initialState = {
  data: {},
  isLoading: true,
  error: null,
};

export function useQuery(
  endPoint,
  method = "GET",
  initialParams = {},
  body = null
) {
  const [state, dispatch] = useReducer(queryReducer, initialState);
  const memoizedParams = useMemo(
    () => initialParams,
    [JSON.stringify(initialParams)]
  );

  const fetchData = useCallback(
    async (params = memoizedParams) => {
      dispatch({ type: "REQUEST_START" });

      try {
        let result;
        switch (method) {
          case "GET":
            result = await apiClient.get(endPoint, { params });
            // console.log("result", result.data.data);

            break;
          case "POST":
            result = await apiClient.post(endPoint, body, params);
            break;
          case "PATCH":
            result = await apiClient.patch(endPoint, body, params);
            break;
          case "PUT":
            result = await apiClient.put(endPoint, body, params);
            break;
          case "DELETE":
            result = await apiClient.delete(endPoint, params);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        dispatch({
          type: "REQUEST_SUCCESS",
          payload: { data: result.data },
        });
      } catch (error) {
        dispatch({
          type: "REQUEST_ERROR",
          payload: { error },
        });
      }
    },
    [endPoint, method, memoizedParams, JSON.stringify(body)]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(
    (newParams = memoizedParams) => {
      fetchData(newParams);
    },
    [fetchData]
  );

  return { state, refetch, dispatch };
}
