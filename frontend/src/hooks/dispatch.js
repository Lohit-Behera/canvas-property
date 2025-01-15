"use client";

import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Custom hook for handling async Redux actions with toast
export const useDispatchWithToast = (asyncThunkAction, options = {}) => {
  const dispatch = useDispatch();
  
  const {
    loadingMessage = "Loading...",
    getSuccessMessage = (data) => data.message || "Operation successful",
    getErrorMessage = (error) => error?.message || "Operation failed",
    onSuccess,
    onError,
  } = options;

  return async (data) => {
      const promise = dispatch(asyncThunkAction(data)).unwrap();
      
      toast.promise(promise, {
        loading: loadingMessage,
        success: (result) => {
          if (onSuccess) onSuccess(result);
          return getSuccessMessage(result);
        },
        error: (err) => {
            if (err === "Refresh token expired") {
                toast.error("Session expired. Please log in again.");
                router.push("/session-expired");
              }
          if (onError) onError(err);
          return getErrorMessage(err);
        },
      });

      return promise;
  };
};

// Custom hook for handling async Redux actions
export const useAsyncDispatch = (asyncThunkAction, options = {}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { onSuccess, onError } = options;

  return async (data) => {
    try {
      const result = await dispatch(asyncThunkAction(data)).unwrap();
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
        if (error === "Refresh token expired") {
          toast.error("Session expired. Please log in again.");
          router.push("/session-expired");
        }
      if (onError) onError(error);
      throw error;
    }
  };
};