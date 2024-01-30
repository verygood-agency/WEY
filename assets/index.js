import { S as Swiper, N as Navigation, P as Pagination, E as EffectFade, A as Autoplay } from "./swiper.js";
import { g as gsapWithCSS, S as ScrollTrigger } from "./gsap.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
class Header {
  constructor() {
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleButtonClickAddress = this.handleButtonClickAddress.bind(this);
    this.handleButtonClickOutside = this.handleButtonClickOutside.bind(this);
    this.header = document.querySelector("[data-header]");
    this.menu = this.header.querySelector("[data-header-menu]");
    this.targer = this.header.querySelector("[data-header-burger]");
    this.address = this.header.querySelector("[data-header-address]");
    this.addressButton = this.header.querySelector("[data-header-address-button]");
    this.body = document.body;
  }
  init() {
    document.addEventListener("click", this.handleButtonClick);
    document.addEventListener("click", this.handleButtonClickAddress);
    document.addEventListener("click", this.handleButtonClickOutside);
  }
  handleButtonClick(event) {
    const target = event.target.closest("[data-header-burger]") || event.target.hasAttribute("data-header-burger");
    if (!target)
      return false;
    if (this.targer.classList.contains("burger-active")) {
      this.hideMenu();
    } else {
      this.openMenu();
    }
  }
  handleButtonClickAddress(event) {
    const target = event.target.closest("[data-header-address-button]") || event.target.hasAttribute("data-header-address-button");
    if (!target)
      return false;
    this.toggleListAddress();
  }
  handleButtonClickOutside(event) {
    if (this.header && !this.header.contains(event.target) && this.header.classList.contains("address-active")) {
      this.toggleListAddress();
    }
  }
  toggleListAddress() {
    this.header.classList.toggle("address-active");
    this.address.classList.toggle("address-active");
    this.addressButton.classList.toggle("address-active");
  }
  hideMenu() {
    this.targer.classList.remove("burger-active");
    this.body.classList.remove("overflow");
    this.header.classList.remove("header-open");
    this.menu.classList.remove("menu-active");
  }
  openMenu() {
    this.targer.classList.add("burger-active");
    this.body.classList.add("overflow");
    this.header.classList.add("header-open");
    this.menu.classList.add("menu-active");
  }
}
const header = new Header();
class ScrollTo {
  constructor() {
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  init() {
    document.addEventListener("click", this.handleButtonClick);
  }
  handleButtonClick(event) {
    const target = event.target.closest("[data-scroll-from]") || event.target.hasAttribute("data-scroll-from");
    if (!target) {
      return false;
    }
    const targetTo = target.getAttribute("data-scroll-from");
    const element = document.querySelector('[data-scroll-to="' + targetTo + '"]');
    if (!element)
      return false;
    if (target.closest("[data-header]")) {
      header.hideMenu();
    }
    if (header.header.classList.contains("address-active")) {
      header.toggleListAddress();
    }
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start"
    });
  }
}
const scrollTo = new ScrollTo();
class Tabs {
  constructor() {
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  init() {
    document.addEventListener("click", this.handleButtonClick);
  }
  handleButtonClick(event) {
    const targetButton = event.target.closest("[data-tabs-control]") || event.target.hasAttribute("data-tabs-control");
    if (!targetButton)
      return false;
    const tabsWrapper = targetButton.closest("[data-tabs]");
    const targetValueWrapper = tabsWrapper.getAttribute("data-tabs");
    const tabsControls = tabsWrapper.querySelector('[data-tabs-header="' + targetValueWrapper + '"]');
    const tabsContents = tabsWrapper.querySelector('[data-tabs-block="' + targetValueWrapper + '"]');
    if (targetButton.classList.contains("button-active"))
      return false;
    const activeButtons = tabsControls.querySelectorAll(".button-active");
    if (activeButtons) {
      activeButtons.forEach((button) => {
        if (button.closest("[data-tabs-header]").getAttribute("data-tabs-header") === targetValueWrapper) {
          button.classList.remove("button-active");
        }
      });
    }
    const activeBlocks = tabsContents.querySelectorAll(".block-active");
    if (activeBlocks) {
      activeBlocks.forEach((block) => {
        if (block.closest("[data-tabs-block]").getAttribute("data-tabs-block") === targetValueWrapper) {
          block.classList.remove("block-active");
        }
      });
    }
    targetButton.classList.add("button-active");
    const valueTarget = targetButton.getAttribute("data-tabs-control");
    const blockTarget = tabsContents.querySelector('[data-tabs-content="' + valueTarget + '"]');
    if (blockTarget) {
      blockTarget.classList.add("block-active");
    }
  }
}
const tabs = new Tabs();
class Widget {
  constructor() {
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleButtonClickOutside = this.handleButtonClickOutside.bind(this);
    this.closeWidgetButtonClick = this.closeWidgetButtonClick.bind(this);
    this.widget = document.querySelector("[data-widget]");
    this.widgetForm = this.widget.querySelector("[data-widget-form]");
    this.closeWidget = this.widget.querySelector("[data-widget-close]");
  }
  init() {
    document.addEventListener("click", this.handleButtonClick);
    document.addEventListener("click", this.handleButtonClickOutside);
    document.addEventListener("click", this.closeWidgetButtonClick);
  }
  handleButtonClick(event) {
    const target = event.target.closest("[data-widget-button]") || event.target.hasAttribute("data-widget-button");
    if (!target)
      return false;
    this.toggleClassWidget();
  }
  closeWidgetButtonClick(event) {
    const target = event.target.closest("[data-widget-close]") || event.target.hasAttribute("data-widget-close");
    if (!target)
      return false;
    this.toggleClassWidget();
  }
  handleButtonClickOutside(event) {
    if (this.widget && !this.widget.contains(event.target) && !this.closeWidget.contains(event.target) && this.widgetForm.classList.contains("widget-active")) {
      this.toggleClassWidget();
    }
  }
  toggleClassWidget() {
    this.widgetForm.classList.toggle("widget-active");
  }
}
const widget = new Widget();
const ymaps3 = window.ymaps3;
const mapMarkers = [
  {
    coordinates: [55.773449, 37.655332],
    dealerName: "Название дилера 2",
    address: "г. Москва, Волгоградский пр-т., 41, стр.1 2",
    workTime: "пн - вс: с 09:00 по 21:40 2",
    phone: "+7 (495) 445-59-72 2",
    services: [
      "Кузовной ремонт 2",
      "Автосервис 2",
      "Тест-драйв 2"
    ]
  },
  {
    coordinates: [55.754971, 37.573151],
    dealerName: "Название дилера",
    address: "г. Москва, Волгоградский пр-т., 41, стр.1",
    workTime: "пн - вс: с 09:00 по 21:40",
    phone: "+7 (495) 445-59-72",
    services: [
      "Кузовной ремонт",
      "Автосервис",
      "Тест-драйв"
    ]
  }
];
mapMarkers.forEach((marker) => {
  marker.coordinates = [marker.coordinates[1], marker.coordinates[0]];
});
mapMarkers.sort((a, b) => {
  if (a.coordinates[0] > b.coordinates[0]) {
    return -1;
  }
  if (a.coordinates[0] < b.coordinates[0]) {
    return 1;
  }
  return 0;
});
class Map {
  constructor() {
    this.mapElement = document.querySelector("#map");
    this.markers = [];
  }
  async init() {
    await ymaps3.ready;
    const {
      YMap,
      YMapDefaultSchemeLayer,
      YMapDefaultFeaturesLayer,
      YMapMarker
    } = ymaps3;
    await ymaps3.import("@yandex/ymaps3-markers@0.0.1");
    const map2 = new YMap(
      this.mapElement,
      {
        location: {
          center: [37.588144, 55.733842],
          zoom: 10
        }
      }
    );
    const layer = new YMapDefaultSchemeLayer();
    map2.addChild(layer);
    map2.addChild(new YMapDefaultFeaturesLayer({ id: "features" }));
    const _this = this;
    class MarkerWithPopup extends ymaps3.YMapComplexEntity {
      _onAttach() {
        this._actualize();
      }
      _onDetach() {
        this.marker = null;
      }
      _onUpdate(props) {
        var _a;
        if (props.coordinates) {
          (_a = this.marker) == null ? void 0 : _a.update({ coordinates: props.coordinates });
        }
        this._actualize();
      }
      _actualize() {
        const props = this._props;
        this._lazyCreatePopup();
        this._lazyCreateMarker();
        if (!this._state.popupOpen || !props.popupHidesMarker) {
          this.addChild(this.marker);
        } else if (this.marker) {
          this.removeChild(this.marker);
        }
        if (this._state.popupOpen) {
          this.popupElement.style.display = "flex";
        } else if (this.popupElement) {
          this.popupElement.style.display = "none";
        }
      }
      _lazyCreateMarker() {
        if (this.marker)
          return;
        const markerElement = document.createElement("div");
        markerElement.className = "map__marker";
        markerElement.innerHTML = `
          <img src="/map-marker.svg" alt="" >
        `;
        markerElement.onclick = () => {
          _this.markers.forEach((marker) => {
            marker._state.popupOpen = false;
            marker._actualize();
          });
          this._state.popupOpen = true;
          this._actualize();
        };
        this._markerElement = markerElement;
        const container = document.createElement("div");
        container.append(this._markerElement, this.popupElement);
        this.marker = new YMapMarker({ coordinates: this._props.coordinates, zIndex: "unset" }, container);
      }
      _lazyCreatePopup() {
        if (this.popupElement)
          return;
        const element = document.createElement("div");
        element.className = "map__popup";
        element.innerHTML = `
          <div class="map__popup-top">
            <svg class="map__popup-close" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M21 1L10.9998 11.2703M10.9998 11.2703L1.52632 20.9996M10.9998 11.2703L20.4737 21M10.9998 11.2703L1 1.00035" stroke="#B4CAD4" stroke-width="2"/>
            </svg>
            <img src="/map-logo.svg" alt="">
          </div>
          <div class="map__popup-content">
            <h3 class="map__popup-name">${this.markerData.dealerName}</h3>           
            <div class="map__popup-specs">
              <div class="map__popup-spec">
                <div class="map__popup-key">Адрес</div>
                <div class="map__popup-value">${this.markerData.address}</div>
              </div>
              <div class="map__popup-spec">
                <div class="map__popup-key">Часы работы</div>
                <div class="map__popup-value">${this.markerData.workTime}</div>
              </div>
              <div class="map__popup-spec">
                <div class="map__popup-key">Отдел продаж</div>
                <div class="map__popup-value bold-white">${this.markerData.phone}</div>
              </div>
            </div>
            <h4 class="map__popup-services">Услуги дилерского центра</h4>
            ${this.markerData.services.reduce((res, service) => res + `<div class="map__popup-service">${service}</div>`, "")}
          </div>
        `;
        const closeBtn = element.querySelector(".map__popup-close");
        closeBtn.onclick = () => {
          this._state.popupOpen = false;
          this._actualize();
        };
        this.popupElement = element;
      }
      constructor(props) {
        super(props);
        this._state = { popupOpen: false };
        this.markerData = props.markerData;
      }
    }
    mapMarkers.forEach((marker) => {
      const markerInstance = new MarkerWithPopup({
        coordinates: marker.coordinates,
        markerData: marker,
        stylers: [
          {
            zIndex: 10
          }
        ]
      });
      this.markers.push(markerInstance);
      map2.addChild(markerInstance);
    });
  }
}
const map = new Map();
class PopupCookie {
  constructor() {
    this.popupCookie = document.querySelector(".popup-cookie");
    this.popupCookieButton = document.querySelector(".popup-cookie .button");
  }
  init() {
    this.popupCookieButton.addEventListener("click", () => {
      this.popupCookie.classList.add("hide");
    });
  }
}
const popupCookie = new PopupCookie();
class Team {
  constructor() {
    this.teamList = document.querySelector(".team-list");
    this.teamButton = document.querySelector(".team-button");
  }
  init() {
    this.teamButton.addEventListener("click", () => {
      this.teamButton.classList.add("hidden");
      this.teamList.querySelectorAll(".hidden").forEach((item) => {
        item.classList.remove("hidden");
      });
    });
  }
}
const team = new Team();
document.addEventListener("DOMContentLoaded", async () => {
  scrollTo.init();
  header.init();
  tabs.init();
  widget.init();
  popupCookie.init();
  team.init();
  await map.init();
  new Swiper(".swiper", {
    loop: true,
    effect: "fade",
    autoplay: {
      delay: 6e3
    },
    fadeEffect: {
      crossFade: false
    },
    modules: [Navigation, Pagination, EffectFade, Autoplay],
    pagination: {
      el: ".swiper-pagination"
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    breakpoints: {
      768: {
        autoplay: false
      }
    }
  });
  gsapWithCSS.registerPlugin(ScrollTrigger);
  gsapWithCSS.from(".text-scroll", {
    xPercent: 100
  });
  gsapWithCSS.to(".text-scroll", {
    xPercent: -50,
    ease: "none",
    scrollTrigger: {
      trigger: ".block-scroll",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
});
