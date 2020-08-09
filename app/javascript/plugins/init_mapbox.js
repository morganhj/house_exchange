import mapboxgl from 'mapbox-gl';
import cloudinary from 'cloudinary-core';

const initMapbox = () => {
  const cl = new cloudinary.Cloudinary({cloud_name: "mhoare", secure: true });
  const mapElement = document.getElementById('map');

  if (mapElement) { // only build a map if there's a div#map to inject into
    const mbxGeocode = require('@mapbox/mapbox-sdk/services/geocoding');
    const geocodingClient = mbxGeocode({ accessToken: mapElement.dataset.mapboxApiKey });
    mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10'
    });
    
    //TEMP ----------------------------------------------
    // const ne = document.getElementById('ne')
    // const sw = document.getElementById('sw')
    // const zoom = document.getElementById('zoom')
    // map.on('drag', function(e) {
    //   let bounds = map.getBounds()
    //   ne.innerHTML = `[${bounds["_ne"]["lat"].toFixed(3)}] / [${bounds["_ne"]["lng"].toFixed(3)}]`
    //   sw.innerHTML = `[${bounds["_sw"]["lat"].toFixed(3)}] / [${bounds["_sw"]["lng"].toFixed(3)}]`
    // })
    // map.on('zoom', function(e) {
    //   let mapZoom = map.getZoom()
    //   zoom.innerHTML = `${mapZoom}`
    // })
    //TEMP ----------------------------------------------


    const markers = JSON.parse(mapElement.dataset.markers);
    markers.forEach((marker) => {
      const popup = new mapboxgl.Popup().setHTML(marker.infoWindow);
      new mapboxgl.Marker()
        .setLngLat([ marker.lng, marker.lat ])
        .setPopup(popup)
        .addTo(map);
    });

    if (mapElement.dataset.page == "index") {

        let initfilter = JSON.parse(mapElement.dataset.filter)

      geocodingClient.forwardGeocode({
          query: initfilter["address"],
          limit: 1
        })
        .send()
        .then(response => {
          const match = response.body;
          // console.log(`2- ${Date.now()}`)
          console.log(match)
          map.setZoom(10)
          map.setCenter([match.features[0].center[0], match.features[0].center[1]])
        });
      // console.log(`3- ${Date.now()}`)



      // API SEARCH 
      const apiSearch = () => {
        let filter = JSON.parse(mapElement.dataset.filter)
        const homeList = document.getElementById('home-list')
        const bounds = map.getBounds()
        // console.log(`4- ${Date.now()}`)
        const url = `/api/v1/homes?ne_lat=${bounds["_ne"]["lat"]}&ne_lng=${bounds["_ne"]["lng"]}&sw_lat=${bounds["_sw"]["lat"]}&sw_lng=${bounds["_sw"]["lng"]}&category=${filter["category"]}`
        fetch(url)
          .then(response => response.json())
          .then((data) => {
            console.log(data)
            // console.log(`5- ${Date.now()}`)
            homeList.innerHTML = '';
            // console.log(`6- ${Date.now()}`)
            data["homes"].forEach((home) => {

              const customImageTag = (home) => {
                let result = ''
                if (home["home_images"].length > 0) {
                  result = `<img src=${home['home_images'][home["home_images"].length - 1]} alt="" class="d-block w-100 home-carousel-image" />`
                } else {
                  result = `<img class="d-block w-100 home-carousel-image" style="height: 230px;" src="https://images.unsplash.com/photo-1519226612673-73c0234437ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" alt="Card image cap">`                       
                }
                return result           
              }
              const imageList = (home) => {
                let result = ''
                home["home_images"].forEach((photo) => {
                  result = result + `\n <div class="carousel-item" data-interval="2000">
                  <img src="${photo}" class="d-block w-100 home-carousel-image" />
                  </div>`})
                return result
              }
              const garage_svg_url = `https://res.cloudinary.com/mhoare/image/upload/v1594179931/garage.svg`
              const bathtub_svg_url = `https://res.cloudinary.com/mhoare/image/upload/v1594178169/bathtub.svg`
              const capacity_svg_url = `https://res.cloudinary.com/mhoare/image/upload/v1594178167/group.svg`
              const spaces_svg_url = `https://res.cloudinary.com/mhoare/image/upload/v1594178167/blueprint.svg`
              const total_area_svg_url = `https://res.cloudinary.com/mhoare/image/upload/v1594178167/measure.svg`
              const homeCard = `
                                  <div class="row shadow-sm home-card" style="background-color: rgba(0,0,0,0.05);">
                                    <div class="col-12 col-lg-4 p-0 rounded-left overflow-hidden">  
                                      <div id="carouselExampleFade-${home["id"]}" class="carousel slide carousel-fade rounded" data-ride="carousel">
                                        <div class="carousel-inner">
                                          <div class="carousel-item active" data-interval="10000">
                                            ${ customImageTag(home) }
                                          </div>
                                          ${ imageList(home) }
                                        </div>
                                        <a class="carousel-control-prev" href="#carouselExampleFade-${home["id"]}" role="button" data-slide="prev">
                                          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                          <span class="sr-only">Previous</span>
                                        </a>
                                        <a class="carousel-control-next" href="#carouselExampleFade-${home["id"]}" role="button" data-slide="next">
                                          <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                          <span class="sr-only">Next</span>
                                        </a>
                                      </div>
                                    </div>
                                    <a href="/homes/${home["id"]}" class="col-12 col-lg-8 home-card-content">
                                      <div class="row home-card-body p-2" style="height: 140px; overflow: hidden">
                                        <div class="col-12 p-0">
                                          <h6 class="card-title mb-1">${home["name"]}</h6>
                                          <h7 class="card-text" style="color: black;">${home["description"]}</h7>
                                        </div>
                                      </div>
                                      <div class="row home-card-body px-2" style="height: 40px; overflow: hidden">
                                          <div class="col-12 d-flex justify-content-around p-0">
                                              <div class="d-flex border-right pr-2">
                                                <div class="char-svg mr-2 py-auto" id="group-svg">
                                                  <img src="${capacity_svg_url}" alt="" />
                                                </div>
                                                <span class="font-weight-bolder text-dark py-auto">${home["spec"]["capacity"]} p</span>
                                              </div>
                                              <div class="d-flex border-right pr-2">
                                                <div class="char-svg mr-2 py-auto" id="blueprint-svg">
                                                  <img src="${spaces_svg_url}" alt="" />
                                                </div>
                                                  <span class="font-weight-bolder text-dark py-auto">${home["spec"]["rooms"]}</span>
                                              </div>
                                              <div class="d-flex border-right pr-2">
                                                <div class="char-svg mr-2 py-auto" id="measure-svg">
                                                <img src="${total_area_svg_url}" alt="" />
                                                </div>
                                                  <span class="font-weight-bolder text-dark py-auto">${home["spec"]["area"]} m2</span>
                                              </div>
                                              <div class="d-flex border-right pr-2">
                                                <div class="char-svg mr-2 py-auto" id="bathtub-svg">
                                                <img src="${bathtub_svg_url}" alt="" />
                                                </div>
                                                  <span class="font-weight-bolder text-dark py-auto">${home["spec"]["bathrooms"]}</span>
                                              </div>
                                              <div class="d-flex">
                                                <div class="char-svg mr-2 py-auto" id="garage-svg">
                                                <img src="${garage_svg_url}" alt="" />
                                                </div>
                                                  <span class="font-weight-bolder text-dark py-auto">${home["spec"]["capacity"]}</span>
                                              </div>
                                          </div>
                                      </div>
                                      <div class="row home-card-footer rounded" style="height: 80px; overflow: hidden; padding-bottom: 15px;">
                                        <small class="col-8 text-muted" style="align-self: flex-end"> 
                                          ${home["category"]["name"]} ${home["address"]}
                                          <i class="fas fa-map-marker-alt"></i>
                                        </small>
                                        <div class="col-4 d-flex justify-content-center align-items-end">
                                          <div class="home-card-rating">
                                            <div class="d-flex"><i class="fas fa-star mr-1 my-auto"></i><p style="color: black;">4.7</p></div>
                                            <p style="color: black;">(55)</p>
                                          </div>
                                        </div>
                                      </div>
                                    </a>
                                  </div>
                                <hr class="divider divider-fade" />`

              homeList.insertAdjacentHTML("beforeend", homeCard)
            })
          }
        ); 
      }
      // console.log(`7- ${Date.now()}`)
      setTimeout(apiSearch, 2000)



      const filterBtn = document.getElementById('filter-btn')
      if (filterBtn) {    
        filterBtn.onclick = function() {
          let newLocation = document.getElementById('city').value
          if ( newLocation == "" ) {
            newLocation = document.getElementById('city').placeholder
          }
          let category = document.getElementById('_homes_category').value
          let newFilter = `{ "category": "${category}" }`
          mapElement.setAttribute('data-filter', newFilter)
          geocodingClient.forwardGeocode({
            query: newLocation,
            limit: 1
          })
          .send()
          .then(response => {
            const match = response.body;
            map.setZoom(10)
            map.panTo([match.features[0].center[0],match.features[0].center[1]])
          });
          setTimeout(apiSearch, 500)
        }
      }

      map.on('dragend', function(e) {
        setTimeout(apiSearch, 1000)
      })

      map.on('zoomend', function(e) {
        setTimeout(apiSearch, 1000)
      })


    } else {
      map.setZoom(10)
      map.setCenter({ "lng": markers[0].lng, "lat": markers[0].lat })
    }
  }




};

export { initMapbox };
