Rails.application.routes.draw do

  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  root to: 'pages#landing'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :homes, only: [:index, :new, :create]
  resources :spec, only: [:new, :create]
end
