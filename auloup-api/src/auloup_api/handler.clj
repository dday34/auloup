(ns auloup-api.handler
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.util.response :refer [response]]
            [ring.middleware.defaults :refer [wrap-defaults api-defaults]]
            [ring.middleware.json :refer [wrap-json-response wrap-json-body]]
            [amazonica.aws.ecs :as ecs]))

(def creds-info {:endpoint "eu-west-1"})

(defn get-ecs-services-info [cluster]
  (let [services (:service-arns (ecs/list-services creds-info :cluster cluster))]
    (->> (ecs/describe-services creds-info :cluster cluster :services services)
         :services
         (map #(select-keys % [:status :service-name])))))

(defroutes app-routes
  (GET "/ecs-cluster/:cluster/services" [cluster]
       (response (get-ecs-services-info cluster)))
  (route/not-found "Not Found"))

(def app
  (-> app-routes
      (wrap-json-response)
      (wrap-json-body)
      (wrap-defaults api-defaults)))
