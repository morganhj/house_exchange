Rails.application.routes.draw do

  namespace :api do
    namespace :v1 do
      get 'homes/index'
    end
  end
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  root to: 'pages#landing'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :homes
  resources :spec, only: [:new, :create]

  # API for fetching homes from front-end!
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :homes, only: [ :index ]
    end
  end
end
