'use client'

import { useEffect, useRef } from 'react'

interface MapProps {
  className?: string
}

declare global {
  interface Window {
    L: any
  }
}

export default function Map({ className }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // 지도가 이미 생성되었다면 재생성하지 않음
    if (mapInstance.current) return

    // Leaflet 라이브러리가 로드될 때까지 기다림
    const initMap = () => {
      if (!window.L) {
        setTimeout(initMap, 100)
        return
      }

      // 인천광역시 서구 청라한내로72번길 13의 좌표
      const lat = 37.5345
      const lng = 126.6515

      // 지도 생성
      const map = window.L.map(mapRef.current).setView([lat, lng], 16)

      // OpenStreetMap 타일 레이어 추가
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map)

      // 사용자 정의 아이콘 생성
      const customIcon = window.L.divIcon({
        html: `
          <div style="
            background-color: #1e40af;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            border: 3px solid #ffffff;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            <div style="
              background-color: #ffffff;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      })

      // 마커 추가
      const marker = window.L.marker([lat, lng], { icon: customIcon }).addTo(map)

      // 팝업 추가
      marker.bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <strong style="color: #1e40af; font-size: 16px;">한국가전유지관리협회</strong><br>
          <div style="margin-top: 8px; color: #6b7280; font-size: 14px;">
            인천광역시 서구 청라한내로72번길 13<br>
            (청라동) 203호
          </div>
          <div style="margin-top: 8px; color: #374151; font-size: 14px;">
            <strong>대표번호:</strong> 1566-3321
          </div>
        </div>
      `).openPopup()

      mapInstance.current = map

      // 지도 크기 재조정 (컨테이너 크기 변화에 대응)
      setTimeout(() => {
        map.invalidateSize()
      }, 100)
    }

    initMap()

    // 컴포넌트 언마운트 시 지도 정리
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full min-h-[320px] rounded-xl ${className || ''}`}
      style={{ zIndex: 1 }}
    />
  )
}